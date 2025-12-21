# game.py - Base Playno Game Engine
from direct.showbase.ShowBase import ShowBase
from direct.gui.DirectGui import DirectButton, DirectLabel
from panda3d.core import (
    NodePath, Vec3, AmbientLight, DirectionalLight, Material, 
    load_prc_file_data, CardMaker, TransparencyAttrib
) 
import math
import os
import json
import sys

# --- CONFIGURATION ---
GRAVITY = -35.0
JUMP_FORCE = 15.0
WALK_SPEED = 10.0
RUN_ANIM_SPEED = 10.0
ROBLOX_SCALE = 0.5
PLAYER_RADIUS = 1.0

ASSETS_DIR = r"C:\Playno\assets\textures"
GAMES_DIR = r"C:\Playno\data\games"

if os.path.exists(ASSETS_DIR):
    load_prc_file_data("", f"model-path {ASSETS_DIR.replace(os.sep, '/')}")

COLOR_TORSO = (0, 0, 1, 1)
COLOR_HEAD = (1, 1, 1, 1)
COLOR_LEGS = (1, 1, 0, 1)
COLOR_ARMS = (0, 1, 0, 1)

class PlaynoGame(ShowBase):
    def __init__(self, game_file=None):
        super().__init__()
        self.disableMouse()
        self.setBackgroundColor(0.5, 0.5, 0.5)

        self.velocity_z = 0
        self.is_grounded = False
        self.walk_cycle = 0
        self.floor_height = 0.5

        self.key_map = {"w": 0, "s": 0, "a": 0, "d": 0, "space": 0}
        self.cam_rotate = {"left": 0, "right": 0}
        
        self.cam_distance = 20 
        self.cam_h = 0
        self.cam_p = -20
        self.mouse_drag = False
        self.mouse_last = None

        self.setup_controls()
        self.setup_lights()
        
        if game_file and os.path.exists(game_file):
            self.load_game(game_file)
        else:
            self.create_default_world()
        
        self.create_character()
        
        self.taskMgr.add(self.update_task, "update_task")
        self.update_camera(0.01)

    def load_game(self, game_file):
        """Load game from .plno file"""
        try:
            with open(game_file, 'r') as f:
                game_data = json.load(f)
            
            print(f"Loading game: {game_data['name']}")
            for part in game_data['parts']:
                self.create_colored_box(
                    self.render,
                    tuple(part['pos']),
                    tuple(part['size']),
                    tuple(part['color'])
                )
        except Exception as e:
            print(f"Error loading game: {e}")
            self.create_default_world()

    def create_default_world(self):
        """Create default world"""
        self.create_colored_box(self.render, (0, 0, 0), (100, 100, 1), (0.3, 0.3, 0.3, 1))
        self.create_colored_box(self.render, (5, 5, 1), (2, 2, 2), (1, 0, 0, 1))
        self.create_colored_box(self.render, (-8, 3, 1), (3, 3, 2), (0, 0.8, 0, 1))

    def create_colored_box(self, parent, pos, size, color):
        anchor = NodePath("part_anchor")
        anchor.reparentTo(parent)
        anchor.setPos(pos)

        model = self.loader.loadModel("models/box")
        model.reparentTo(anchor)
        model.setScale(size)
        model.setPos(-size[0]/2, -size[1]/2, -size[2]/2)

        model.clearTexture()
        model.setTextureOff(1)
        model.setColor(*color)
        model.setColorScaleOff()
        
        mat = Material()
        mat.setDiffuse(color)
        ambient_color = (color[0]*0.4, color[1]*0.4, color[2]*0.4, 1)
        mat.setAmbient(ambient_color)
        mat.setSpecular((0.2, 0.2, 0.2, 1))
        mat.setShininess(10)
        model.setMaterial(mat)

        return anchor

    def setup_lights(self):
        self.render.clearLight()
        alight = AmbientLight('alight')
        alight.setColor((0.6, 0.6, 0.6, 1))
        alnp = self.render.attachNewNode(alight)
        self.render.setLight(alnp)
        
        dlight = DirectionalLight('dlight')
        dlight.setColor((0.7, 0.7, 0.7, 1))
        dlnp = self.render.attachNewNode(dlight)
        dlnp.setHpr(45, -60, 0)
        self.render.setLight(dlnp)

    def create_character(self):
        self.player = NodePath("Player")
        self.player.reparentTo(self.render)
        self.player.setPos(0, 0, 10)
        self.player.setScale(ROBLOX_SCALE) 

        self.torso = self.create_colored_box(self.player, (0, 0, 3), (2, 1, 2), COLOR_TORSO)
        self.head = self.create_colored_box(self.torso, (0, 0, 1.6), (1.2, 1.2, 1.2), COLOR_HEAD)
        self.create_face(self.head)

        self.l_leg = self.create_colored_box(self.torso, (-0.5, 0, -1), (1, 1, 2), COLOR_LEGS)
        self.r_leg = self.create_colored_box(self.torso, (0.5, 0, -1), (1, 1, 2), COLOR_LEGS)
        self.l_arm = self.create_colored_box(self.torso, (-1.5, 0, 1), (1, 1, 2), COLOR_ARMS)
        self.r_arm = self.create_colored_box(self.torso, (1.5, 0, 1), (1, 1, 2), COLOR_ARMS)

    def create_face(self, parent):
        try:
            cm = CardMaker('face_card')
            cm.setFrame(-0.5, 0.5, -0.5, 0.5)
            face_card = parent.attachNewNode(cm.generate())
            face_card.setPos(0, 0.61, 0)
            face_card.setH(180)
            tex = self.loader.loadTexture("smile.png")
            face_card.setTexture(tex)
            face_card.setTransparency(TransparencyAttrib.MAlpha)
        except:
            pass

    def check_collision(self, pos):
        x, y, z = pos
        ground_height = self.floor_height
        
        for child in self.render.getChildren():
            if "part" in child.getName():
                cp = child.getPos()
                cs = child.getScale()
                if abs(x - cp.x) < PLAYER_RADIUS + cs.x/2 and abs(y - cp.y) < PLAYER_RADIUS + cs.y/2:
                    ground_height = max(ground_height, cp.z + cs.z/2)
        
        return ground_height

    def update_task(self, task):
        dt = globalClock.getDt()
        if dt > 0.2:
            dt = 0.016

        self.velocity_z += GRAVITY * dt
        new_z = self.player.getZ() + self.velocity_z * dt
        
        ground_z = self.check_collision((self.player.getX(), self.player.getY(), new_z))
        ground_z += PLAYER_RADIUS
        
        if new_z <= ground_z:
            self.player.setZ(ground_z)
            self.velocity_z = 0
            self.is_grounded = True
        else:
            self.player.setZ(new_z)
            self.is_grounded = False

        moving = False
        rad_h = math.radians(self.cam_h)
        forward = Vec3(math.sin(rad_h), -math.cos(rad_h), 0)
        right = Vec3(math.cos(rad_h), math.sin(rad_h), 0)
        move_vec = Vec3(0, 0, 0)
        
        if self.key_map["w"]: move_vec += forward
        if self.key_map["s"]: move_vec -= forward
        if self.key_map["d"]: move_vec += right
        if self.key_map["a"]: move_vec -= right

        if move_vec.length() > 0:
            moving = True
            move_vec.normalize()
            self.player.setPos(self.player.getPos() + move_vec * WALK_SPEED * dt)
            self.player.setH(math.degrees(math.atan2(move_vec.x, -move_vec.y)) - 180)

        if self.key_map["space"] and self.is_grounded:
            self.velocity_z = JUMP_FORCE
            self.is_grounded = False

        if moving and self.is_grounded:
            self.walk_cycle += dt * RUN_ANIM_SPEED
            angle = math.sin(self.walk_cycle) * 45 
            self.l_leg.setP(angle)
            self.r_leg.setP(-angle)
            self.l_arm.setP(-angle)
            self.r_arm.setP(angle)
        else:
            self.l_leg.setP(0)
            self.r_leg.setP(0)
            if not self.is_grounded:
                self.l_arm.setP(160)
                self.r_arm.setP(160)
            else:
                self.l_arm.setP(0)
                self.r_arm.setP(0)

        self.update_camera(dt)
        return task.cont

    def setup_controls(self):
        self.accept("w", self.set_key, ["w", 1])
        self.accept("w-up", self.set_key, ["w", 0])
        self.accept("s", self.set_key, ["s", 1])
        self.accept("s-up", self.set_key, ["s", 0])
        self.accept("a", self.set_key, ["a", 1])
        self.accept("a-up", self.set_key, ["a", 0])
        self.accept("d", self.set_key, ["d", 1])
        self.accept("d-up", self.set_key, ["d", 0])
        self.accept("space", self.set_key, ["space", 1])
        self.accept("space-up", self.set_key, ["space", 0])
        
        self.accept("arrow_left", self.set_key, ["left", 1])
        self.accept("arrow_left-up", self.set_key, ["left", 0])
        self.accept("arrow_right", self.set_key, ["right", 1])
        self.accept("arrow_right-up", self.set_key, ["right", 0])
        
        self.accept("mouse3", self.start_drag)
        self.accept("mouse3-up", self.stop_drag)
        self.accept("escape", sys.exit)

    def set_key(self, key, value):
        if key in self.key_map: 
            self.key_map[key] = value
        elif key in self.cam_rotate: 
            self.cam_rotate[key] = value

    def start_drag(self):
        if self.mouseWatcherNode.hasMouse():
            self.mouse_drag = True
            self.mouse_last = (self.mouseWatcherNode.getMouseX(), self.mouseWatcherNode.getMouseY())

    def stop_drag(self):
        self.mouse_drag = False
        self.mouse_last = None

    def update_camera(self, dt):
        if self.cam_rotate["left"]: 
            self.cam_h += 100 * dt
        if self.cam_rotate["right"]: 
            self.cam_h -= 100 * dt

        if self.mouse_drag and self.mouseWatcherNode.hasMouse():
            x = self.mouseWatcherNode.getMouseX()
            y = self.mouseWatcherNode.getMouseY()
            if self.mouse_last:
                dx = x - self.mouse_last[0]
                dy = y - self.mouse_last[1]
                self.cam_h -= dx * 150
                self.cam_p = max(-80, min(85, self.cam_p + dy * 100))
            self.mouse_last = (x, y)

        rad_h = math.radians(self.cam_h)
        rad_p = math.radians(self.cam_p)
        
        target = self.player.getPos()
        target.z += 3 * ROBLOX_SCALE 
        
        cam_x = target.x + self.cam_distance * math.sin(rad_h) * math.cos(rad_p)
        cam_y = target.y - self.cam_distance * math.cos(rad_h) * math.cos(rad_p)
        cam_z = target.z + self.cam_distance * math.sin(rad_p)
        
        self.camera.setPos(cam_x, cam_y, cam_z)
        self.camera.lookAt(target)

if __name__ == "__main__":
    game_file = sys.argv[1] if len(sys.argv) > 1 else None
    game = PlaynoGame(game_file)
    game.run()
