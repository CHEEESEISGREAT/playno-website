# launcher.py - Simple GUI launcher for Playno games
import os
import json
import subprocess
import tkinter as tk
from tkinter import ttk

GAMES_DIR = r"C:\Playno\data\games"

class PlaynoLauncher:
    def __init__(self):
        self.window = tk.Tk()
        self.window.title("PLAYNO Launcher")
        self.window.geometry("600x500")
        self.window.configure(bg='#667eea')
        
        # Title
        title = tk.Label(self.window, text="PLAYNO", font=("Arial", 48, "bold"), 
                        bg='#667eea', fg='white')
        title.pack(pady=20)
        
        subtitle = tk.Label(self.window, text="fun for all", font=("Arial", 16), 
                           bg='#667eea', fg='white')
        subtitle.pack()
        
        # Games frame
        games_frame = tk.Frame(self.window, bg='white', relief=tk.RAISED, bd=2)
        games_frame.pack(pady=30, padx=40, fill=tk.BOTH, expand=True)
        
        tk.Label(games_frame, text="Select a Game", font=("Arial", 16, "bold"), 
                bg='white').pack(pady=10)
        
        # Listbox for games
        self.games_list = tk.Listbox(games_frame, font=("Arial", 12), 
                                     bg='#f0f0f0', selectmode=tk.SINGLE, height=10)
        self.games_list.pack(padx=20, pady=10, fill=tk.BOTH, expand=True)
        
        # Load games
        self.load_games()
        
        # Play button
        play_btn = tk.Button(self.window, text="PLAY", font=("Arial", 16, "bold"),
                            bg='#764ba2', fg='white', command=self.launch_game,
                            padx=40, pady=10, cursor='hand2')
        play_btn.pack(pady=10)
        
        # Bind double-click
        self.games_list.bind('<Double-Button-1>', lambda e: self.launch_game())
        
    def load_games(self):
        """Load all .plno files from games directory"""
        if not os.path.exists(GAMES_DIR):
            self.games_list.insert(tk.END, "No games found!")
            return
        
        self.game_files = []
        for filename in os.listdir(GAMES_DIR):
            if filename.endswith('.plno'):
                filepath = os.path.join(GAMES_DIR, filename)
                try:
                    with open(filepath, 'r') as f:
                        game_data = json.load(f)
                        game_name = game_data.get('name', filename[:-5])
                        likes = game_data.get('likes', 0)
                        creator = game_data.get('creator', 'Unknown')
                        
                        display_text = f"{game_name} - by {creator} (❤ {likes})"
                        self.games_list.insert(tk.END, display_text)
                        self.game_files.append(filepath)
                except:
                    continue
    
    def launch_game(self):
        """Launch selected game"""
        selection = self.games_list.curselection()
        if not selection:
            return
        
        game_file = self.game_files[selection[0]]
        print(f"Launching: {game_file}")
        
        # Launch game.py with the selected game file
        subprocess.Popen(['python', 'game.py', game_file])
        self.window.quit()
    
    def run(self):
        self.window.mainloop()

if __name__ == "__main__":
    launcher = PlaynoLauncher()
    launcher.run()
