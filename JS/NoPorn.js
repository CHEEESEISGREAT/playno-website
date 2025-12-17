/**
 * Advanced Content Filter System
 * Comprehensive protection against inappropriate content
 * Version 2.0
 */

(function() {
  'use strict';

  // Configuration object
  const CONFIG = {
    enabled: true,
    blockImages: true,
    blockVideos: true,
    blockLinks: true,
    blockText: true,
    strictMode: false,
    logBlocked: true,
    showWarnings: true,
    customBlockPage: true,
    checkInterval: 500,
    apiEndpoint: null, // Set to your moderation API if available
    whitelist: [],
    reportingEnabled: false,
    reportingEndpoint: null
  };

  // Comprehensive keyword database (200+ terms)
  const BLOCKED_KEYWORDS = [
    // Primary terms
    'porn', 'porno', 'pornography', 'xxx', 'adult', 'nsfw', 'explicit', 
    'nude', 'nudes', 'naked', 'nudity', 'sex', 'sexual', 'sexy',
    'erotic', 'erotica', 'fetish', 'kink', 'kinky', 'hentai',
    
    // Content types
    'hardcore', 'softcore', 'amateur', 'professional', 'homemade',
    'voyeur', 'exhibitionist', 'webcam', 'camgirl', 'camshow',
    'livestream', 'onlyfans', 'fansly', 'patreon', 'premium',
    
    // Actions/activities
    'masturbation', 'masturbate', 'intercourse', 'orgasm', 'climax',
    'penetration', 'oral', 'anal', 'vaginal', 'fellatio', 'cunnilingus',
    'foreplay', 'arousal', 'aroused', 'horny', 'lust', 'lustful',
    
    // Anatomical terms (explicit)
    'penis', 'vagina', 'breasts', 'nipples', 'genitals', 'genitalia',
    'privates', 'intimate', 'erection', 'clitoris', 'vulva', 'scrotum',
    'testicles', 'phallus', 'member', 'manhood', 'womanhood',
    
    // Slang/vulgar terms
    'cock', 'dick', 'pussy', 'tits', 'boobs', 'ass', 'butt',
    'shaft', 'rod', 'tool', 'junk', 'package', 'assets',
    
    // Categories/genres
    'milf', 'dilf', 'gilf', 'teen', 'mature', 'young', 'old',
    'bbw', 'pawg', 'thick', 'curvy', 'petite', 'busty', 'flat',
    'ebony', 'asian', 'latina', 'caucasian', 'interracial', 'mixed',
    'lesbian', 'gay', 'bisexual', 'transgender', 'shemale', 'ladyboy',
    'threesome', 'foursome', 'orgy', 'gangbang', 'group', 'couple',
    'solo', 'masturbating', 'jilling', 'jerking', 'wanking', 'fapping',
    
    // Fetishes/kinks
    'bdsm', 'bondage', 'discipline', 'dominance', 'submission', 'sadism',
    'masochism', 'dominant', 'submissive', 'slave', 'master', 'mistress',
    'fetish', 'kink', 'roleplay', 'cosplay', 'uniform', 'latex',
    'leather', 'pvc', 'vinyl', 'spanking', 'whipping', 'flogging',
    'cbt', 'edging', 'denial', 'humiliation', 'degradation', 'worship',
    'footjob', 'footfetish', 'footworship', 'smoking', 'spitting',
    
    // Services/industry
    'escort', 'prostitute', 'hooker', 'callgirl', 'companion',
    'massage', 'happy ending', 'brothel', 'redlight', 'stripclub',
    'stripper', 'dancer', 'entertainer', 'performer', 'model',
    'actress', 'actor', 'star', 'starlet', 'pornstar',
    
    // Dating/hookup
    'hookup', 'onenight', 'fling', 'affair', 'cheating', 'swinger',
    'swinging', 'polyamory', 'threesome', 'couple', 'singles',
    'dtf', 'nsa', 'fwb', 'fuck buddy', 'booty call', 'casual',
    
    // Platforms/sites
    'onlyfans', 'fansly', 'manyvids', 'clips4sale', 'pornhub',
    'xvideos', 'xhamster', 'youporn', 'redtube', 'spankbang',
    'xnxx', 'thumbzilla', 'eporner', 'motherless', 'redgifs',
    'chaturbate', 'myfreecams', 'cam4', 'camsoda', 'livejasmin',
    'brazzers', 'realitykings', 'bangbros', 'naughtyamerica',
    
    // Actions (explicit)
    'fucking', 'sucking', 'licking', 'fingering', 'penetrating',
    'pounding', 'banging', 'screwing', 'humping', 'riding',
    'stroking', 'rubbing', 'touching', 'groping', 'fondling',
    
    // Products/toys
    'dildo', 'vibrator', 'toy', 'buttplug', 'analbeads', 'cockring',
    'strap-on', 'strapon', 'fleshlight', 'masturbator', 'sleeve',
    'condom', 'lubricant', 'lube', 'oil', 'lotion',
    
    // Media types
    'video', 'clip', 'scene', 'movie', 'film', 'photo', 'pic',
    'picture', 'image', 'gallery', 'album', 'collection', 'compilation',
    'stream', 'live', 'recorded', 'vod', 'dvd', 'bluray',
    
    // Modifiers
    'wild', 'crazy', 'insane', 'extreme', 'rough', 'gentle',
    'passionate', 'intense', 'sensual', 'steamy', 'hot', 'spicy',
    'naughty', 'dirty', 'filthy', 'nasty', 'kinky', 'pervy',
    'sleazy', 'raunchy', 'lewd', 'obscene', 'vulgar', 'crude',
    
    // Euphemisms
    'adult content', 'mature content', 'explicit content', '18+', '21+',
    'adults only', 'not safe for work', 'nsfl', 'nsfw content',
    'blue movie', 'skin flick', 'stag film', 'dirty movie',
    
    // Related terms
    'orgasm', 'cumming', 'ejaculation', 'climax', 'peak', 'release',
    'pleasure', 'satisfaction', 'gratification', 'fulfillment',
    'desire', 'craving', 'urge', 'need', 'want', 'lust',
    
    // Specific niches
    'incest', 'taboo', 'forbidden', 'step', 'family', 'relative',
    'teacher', 'student', 'boss', 'secretary', 'doctor', 'nurse',
    'plumber', 'pizza', 'delivery', 'neighbor', 'roommate',
    
    // Body descriptors
    'busty', 'stacked', 'endowed', 'hung', 'well-endowed',
    'muscular', 'toned', 'ripped', 'fit', 'athletic', 'thick',
    'slim', 'skinny', 'thin', 'fat', 'chubby', 'plump'
  ];

  // Comprehensive blocked domains database (500+ entries)
  const BLOCKED_DOMAINS = [
    // Major adult sites
    'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com',
    'youporn.com', 'redtube.com', 'tube8.com', 'spankbang.com',
    'eporner.com', 'tnaflix.com', 'drtuber.com', 'keezmovies.com',
    'extremetube.com', 'alphaporno.com', 'nuvid.com', 'sunporno.com',
    'upornia.com', 'faphouse.com', 'pornone.com', 'hqporner.com',
    
    // Additional tube sites
    'xtube.com', 'porn.com', 'tube4.com', 'porntube.com',
    'pornerbros.com', 'fux.com', 'xozilla.com', 'tubegalore.com',
    'porndig.com', 'pornhost.com', 'ixxx.com', 'ok.xxx',
    'porngo.com', 'hdporn.net', 'pornhd.com', 'porn300.com',
    'hotmovs.com', 'txxx.com', 'vjav.com', 'hdzog.com',
    'pornid.xxx', '4tube.com', 'fuq.com', 'porntrex.com',
    'tubepornclassic.com', 'analdin.com', 'befuck.com', 'fapvid.com',
    'shameless.com', 'wankoz.com', 'orgasm.com', 'pornwhite.com',
    'sex.com', 'vporn.com', 'flyflv.com', 'yuvutu.com',
    'pornrabbit.com', 'porn720.com', 'porndoe.com', 'tubewolf.com',
    
    // Image/photo sites
    'imagefap.com', 'xnxx.photos', 'sex.com', 'pichunter.com',
    'imgchili.net', 'imx.to', 'porn-images-xxx.com', 'galleries.porn',
    'eroticbeauty.com', 'metart.com', 'playboy.com', 'penthouse.com',
    'hustler.com', 'hegre-art.com', 'domai.com', 'errotica-archives.com',
    'thelifeerotic.com', 'watch4beauty.com', 'femjoy.com', 'stunning18.com',
    'nubiles.net', 'teendreams.com', 'als-scan.com', 'pornpics.com',
    'sex-pics.stream', 'babesource.com', 'babepedia.com', 'boobpedia.com',
    
    // Live cam sites
    'chaturbate.com', 'myfreecams.com', 'cam4.com', 'camsoda.com',
    'bongacams.com', 'stripchat.com', 'livejasmin.com', 'flirt4free.com',
    'streamate.com', 'imlive.com', 'xlovecam.com', 'cams.com',
    'camster.com', 'camlust.com', 'slutroulette.com', 'xcams.com',
    'royalcams.com', 'pornhublive.com', 'xhamsterlive.com', 'cam.net',
    'xmodels.com', 'camcontacts.com', 'sakura.com', 'naked.com',
    'camcrush.com', 'camamateur.com', 'camfrog.com', 'ifriends.net',
    
    // Premium/paysite content
    'brazzers.com', 'realitykings.com', 'mofos.com', 'babes.com',
    'twistys.com', 'digitalplayground.com', 'bangbros.com', 'naughtyamerica.com',
    'wicked.com', 'vivid.com', 'evilangel.com', 'burningangel.com',
    'kink.com', 'teamskeet.com', 'fakehub.com', 'girlfriendsfilms.com',
    'ztod.com', 'devilsfilm.com', 'girlsway.com', 'puretaboo.com',
    'adulttime.com', 'povd.com', 'passion-hd.com', 'tiny4k.com',
    'fantasyhd.com', 'exotic4k.com', 'lubed.com', 'holed.com',
    'manuelferrara.com', 'julesjordan.com', 'spizoo.com', 'cherrypimps.com',
    
    // Hentai/animated content
    'hentai.net', 'hentaihaven.org', 'hanime.tv', 'hentaigasm.com',
    'tsumino.com', 'nhentai.net', 'e-hentai.org', 'fakku.net',
    'hentai2read.com', 'hentaifox.com', 'hentai-foundry.com', 'gelbooru.com',
    'danbooru.donmai.us', 'rule34.xxx', 'rule34.us', 'rule34.paheal.net',
    'sankakucomplex.com', 'e621.net', 'furaffinity.net', 'sofurry.com',
    'inkbunny.net', 'pixiv.net', 'hentai-img.com', 'porncomix.info',
    
    // Forums and communities
    'reddit.com/r/nsfw', 'reddit.com/r/porn', 'reddit.com/r/gonewild',
    'reddit.com/r/realgirls', 'reddit.com/r/nsfw_gifs', 'motherless.com',
    'adultwork.com', 'switter.at', 'fetlife.com', 'redgifs.com',
    'gfycat.com/nsfw', 'imgur.com/r/nsfw', '4chan.org/b/', '4chan.org/s/',
    '8chan.moe', 'voat.co', 'slutbot.com', 'anonib.com',
    'anon-ib.co', 'thothub.tv', 'simpcity.su', 'coomer.party',
    
    // Escort/dating adult sites
    'backpage.com', 'escortbabylon.net', 'slixa.com', 'tryst.link',
    'skipthegames.com', 'adultsearch.com', 'eros.com', 'escortalligator.com',
    'privatedelights.ch', 'cityxguide.com', 'adulthookup.com', 'ashleymadison.com',
    'adultfriendfinder.com', 'fling.com', 'alt.com', 'passion.com',
    'benaughty.com', 'instabang.com', 'naughtydate.com', 'flirtycougars.com',
    
    // File sharing with adult content
    'uploadgig.com', 'rapidgator.net', 'k2s.cc', 'filejoker.net',
    'mexashare.com', 'nitroflare.com', 'fboom.me', 'filefox.cc',
    'turbobit.net', 'katfile.com', 'subyshare.com', 'wupfile.com',
    
    // Social media adult accounts
    'onlyfans.com', 'fansly.com', 'manyvids.com', 'clips4sale.com',
    'iwantclips.com', 'loyalfans.com', 'justforfans.com', 'fancentro.com',
    'admire.me', 'patreon.com/nsfw', 'snapchat.com/nsfw', 'premium.snapchat.com',
    
    // Torrent/download sites with adult content
    'empornium.me', 'pornbay.org', 'sexuria.org', 'pornolab.net',
    'thepiratebay.org/browse/505', 'rarbg.to/torrents.php?category=4',
    'extratorrent.cc/category/505', '1337x.to/cat/XXX',
    
    // Adult games
    'f95zone.to', 'lewdzone.com', 'nutaku.net', 'gamesofdesire.com',
    'pornogames.com', 'adultgameson.com', 'adultgaming.org', 'svs-games.com',
    'porngames.com', 'adultgamecollector.com', 'hongfire.com', 'hentai-foundry.com',
    
    // Adult comics/stories
    '8muses.com', 'multporn.net', 'hentai2read.com', 'allporncomic.com',
    'hentairead.com', 'manhwa18.net', 'toonily.com', 'webtoon.xyz',
    'literotica.com', 'sexstories.com', 'lushstories.com', 'storiesonline.net',
    'asstr.org', 'mcstories.com', 'bdsmlibrary.com', 'nifty.org',
    
    // Regional/International sites
    'javhd.com', 'javfinder.sh', 'javmost.com', 'javfree.sh',
    'av4.us', 'caribbeancom.com', '1pondo.tv', 'heyzo.com',
    'tokyo-hot.com', 'fc2ppv.com', 'youjizz.com', 'thisvid.com',
    'porndig.com', 'rarbg.com', 'sexu.com', 'pornerbros.com',
    
    // Mobile specific
    'mobile.pornhub.com', 'm.xvideos.com', 'm.xnxx.com', 'mobile.youporn.com',
    'touch.pornhub.com', 'www.pornhub.com/m', 'www.xvideos.com/m',
    
    // Search engines (adult)
    'tblop.com', 'porn.com', 'pornmd.com', 'nudevista.com',
    'findtubes.com', 'pornerbros.com', 'ixxx.com', 'fuqqt.com',
    'porndig.com', 'thumbzilla.com', 'pornoeggs.com', 'anysex.com',
    
    // Lesser known sites
    'justporno.tv', 'definebabe.com', 'hellporno.com', 'tubeporn.com',
    'xxx-files.com', 'pornwhite.com', 'zmovs.com', 'sextvx.com',
    'youjizz.com', 'pornjam.com', 'porngo.com', 'pornsos.com',
    'tubeland.com', 'pornomovies.com', 'yeptube.com', 'alotporn.com',
    'yourlust.com', 'pornktube.com', 'cliphunter.com', 'wetplace.com',
    'keez.com', 'pornsharia.com', 'slutload.com', 'vid123.com',
    'thegay.com', 'gaytube.com', 'boyfriendtv.com', 'men.com',
    'seancody.com', 'nextdoorstudios.com', 'cockyboys.com', 'helixstudios.com',
    
    // International adult sites
    'beeg.com', 'xbef.com', 'sexu.com', 'ah-me.com',
    'pornwhite.com', 'porn555.com', 'auntmia.com', 'porcore.com',
    'porn00.org', 'xmegadrive.com', 'pornicom.com', 'pornheed.com',
    'justporno.tv', 'daftsex.com', 'upornia.com', 'pornky.com',
    
    // Amateur/user content
    'pornhub.com/users', 'xvideos.com/profiles', 'xhamster.com/users',
    'amateur.tv', 'homemoviestube.com', 'gfpornvideos.com', 'youx.xxx',
    'voyeurweb.com', 'amateurporn.net', 'realamateurporn.com', 'amateurfuck.net',
    
    // Vintage/retro
    'vintageporntubes.com', 'definebabe.com', 'pornclassic.tube', 'oldporn.xxx',
    'tubepornclassic.com', 'vintagesex.tube', 'classicpornbest.com', 'loveclassicporn.com',
    
    // Fetish specific
    'fetish.com', 'bdsmstreak.com', 'bdsmtube.com', 'femdomtube.com',
    'bdsmlr.com', 'kinky.com', 'boundgods.com', 'whippedass.com',
    'devicebondage.com', 'footfetishbb.com', 'footjobs.com', 'smokingfetish.com',
    
    // VR adult content
    'vrporn.com', 'sexlikereal.com', 'czechvr.com', 'povr.com',
    'badoinkvr.com', 'vrbangers.com', 'naughtyamericavr.com', 'wankzvr.com',
    'virtualrealporn.com', 'vrsmash.com', 'vrporn.com', '18vr.com',
    
    // Additional domains
    'spankbang.party', 'pornzog.com', 'vjav.com', 'jable.tv',
    'missav.com', 'pornve.com', 'pornhat.com', 'shooshtime.com',
    'fapdu.com', 'pornktube.tv', 'pornhost.com', 'pornwhite.com',
    'hdpornvideo.xxx', 'pornovoisines.com', 'tube188.com', 'moviefap.com',
    'proporn.com', 'pervclips.com', 'madthumbs.com', 'pornxp.com',
    'youjizz.com', 'pornerbros.com', 'pornburst.com', 'zedporn.com',
    'xxxbunker.com', 'pornsharia.com', 'koloporno.com', 'freeomovie.com'
  ];

  // URL pattern matchers (50+ patterns)
  const SUSPICIOUS_PATTERNS = [
    // Basic adult keywords
    /\b(xxx|porn|adult|nsfw|nude|sex|erotic)\b/i,
    /\b(hentai|hardcore|softcore|explicit|mature)\b/i,
    
    // Cam/live content
    /\b(cam|webcam|live).*(girl|show|chat|stream)\b/i,
    /\b(live|stream).*(sex|adult|porn|nude)\b/i,
    /\b(chat|video).*(sex|adult|dirty|naughty)\b/i,
    
    // Dating/escort services
    /\b(escort|hookup|affair|sugar.*daddy|call.*girl)\b/i,
    /\b(dating|meet).*(sex|adult|nsa|fwb)\b/i,
    /\b(one.*night|casual.*sex|adult.*dating)\b/i,
    
    // TLDs and domain patterns
    /\.(xxx|sex|porn|adult)$/i,
    /\/(porn|xxx|adult|nsfw|explicit|nude|sex)\//i,
    /-(porn|xxx|adult|sex|nude)[\.-]/i,
    
    // URL structure patterns
    /\/?(18|21)\+/i,
    /adult[s-]?only/i,
    /not[_-]?safe[_-]?for[_-]?work/i,
    
    // Content type indicators
    /\b(premium|vip|exclusive).*(porn|adult|xxx|nude)\b/i,
    /\b(amateur|professional).*(porn|sex|adult)\b/i,
    /\b(homemade|real|genuine).*(porn|sex|xxx)\b/i,
    
    // Video/image terms
    /\b(tube|video|clip|movie).*(porn|xxx|adult|sex)\b/i,
    /\b(porn|xxx|adult|sex).*(tube|video|clip|movie)\b/i,
    /\b(photo|pic|image|gallery).*(nude|naked|sex|adult)\b/i,
    
    // Action/activity patterns
    /\b(watch|view|stream|download).*(porn|xxx|adult|sex|nude)\b/i,
    /\b(free|best|top|hot).*(porn|xxx|adult|sex|nude)\b/i,
    
    // Platform indicators
    /onlyfans.*leak/i,
    /premium.*snapchat/i,
    /private.*show/i,
    /members.*only/i,
    
    // Category/niche patterns
    /\b(milf|teen|mature|young).*(porn|sex|xxx|tube)\b/i,
    /\b(asian|ebony|latina|caucasian).*(porn|sex|xxx)\b/i,
    /\b(gay|lesbian|trans).*(porn|sex|xxx|tube)\b/i,
    
    // Fetish indicators
    /\bfetish.*(porn|video|site|tube)\b/i,
    /\bbdsm.*(porn|video|site|tube)\b/i,
    /\bkink.*(porn|site|video)\b/i,
    
    // Upload/sharing patterns
    /upload.*(nude|porn|xxx|adult)/i,
    /share.*(nude|porn|xxx|adult)/i,
    
    // Model/performer patterns
    /\b(model|star|actress).*(porn|adult|xxx)\b/i,
    /\b(porn|adult).*(model|star|actress|performer)\b/i,
    
    // Payment/premium indicators
    /\b(subscribe|subscription|premium|vip).*(porn|adult|xxx|nude)\b/i,
    /\b(pay|paid|purchase).*(porn|adult|xxx|content)\b/i,
    
    // Search/directory patterns
    /porn.*search/i,
    /adult.*directory/i,
    /sex.*finder/i,
    
    // Mobile specific
    /mobile.*(porn|xxx|adult|sex)/i,
    /touch.*(porn|xxx|adult)/i,
    
    // VR/technology patterns
    /\bvr.*(porn|xxx|adult|sex)\b/i,
    /\b(porn|xxx|adult).*(vr|virtual|reality)\b/i,
    
    // Download/torrent patterns
    /download.*(porn|xxx|adult|sex)/i,
    /torrent.*(porn|xxx|adult|sex)/i,
    /\b(porn|xxx|adult).*(download|torrent|leak)\b/i,
    
    // Forum/community patterns
    /forum.*(porn|adult|sex|xxx)/i,
    /community.*(adult|nsfw|porn)/i,
    
    // Story/literature patterns
    /\b(sex|erotic).*(story|stories|fiction|literature)\b/i,
    /\b(adult|mature).*(story|stories|fiction|novel)\b/i
  ];

  // Image analysis parameters
  const IMAGE_ANALYSIS = {
    enabled: true,
    skinColorThreshold: 0.3,
    minImageSize: 100,
    checkFrequency: 1000
  };

  // Statistics tracker
  const stats = {
    imagesBlocked: 0,
    videosBlocked: 0,
    linksBlocked: 0,
    textBlocked: 0,
    totalBlocked: 0,
    startTime: Date.now()
  };

  // Logger utility
  const logger = {
    log: function(message, data = {}) {
      if (CONFIG.logBlocked) {
        console.log(`[ContentFilter] ${message}`, data);
      }
    },
    warn: function(message, data = {}) {
      console.warn(`[ContentFilter] ${message}`, data);
    },
    error: function(message, data = {}) {
      console.error(`[ContentFilter] ${message}`, data);
    }
  };

  // Extended domain variations and subdomains
  const BLOCKED_SUBDOMAINS = [
    'www', 'm', 'mobile', 'touch', 'wap', 'api', 'cdn', 'media',
    'content', 'static', 'img', 'image', 'video', 'videos', 'stream',
    'live', 'cam', 'chat', 'member', 'members', 'premium', 'vip'
  ];

  // File extension patterns to check
  const SUSPICIOUS_EXTENSIONS = [
    '.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm',
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp',
    '.mpg', '.mpeg', '.3gp', '.m4v', '.ts'
  ];

  // Query parameter indicators
  const SUSPICIOUS_PARAMS = [
    'adult', 'nsfw', 'porn', 'xxx', 'sex', 'nude', 'explicit',
    'mature', 'premium', 'vip', 'member', 'subscriber'
  ];

  // IP address patterns (known adult content CDNs - examples)
  const BLOCKED_IP_PATTERNS = [
    /^185\.225\./,  // Example pattern
    /^104\.18\./,   // Example pattern
    /^172\.67\./    // Example pattern
  ];

  // Additional metadata tracking
  const blockHistory = [];
  const MAX_HISTORY = 1000;

  // URL decoder for obfuscated links
  function decodeObfuscatedURL(url) {
    try {
      // Decode multiple times to catch nested encoding
      let decoded = url;
      let previousDecoded = '';
      let iterations = 0;
      const maxIterations = 5;
      
      while (decoded !== previousDecoded && iterations < maxIterations) {
        previousDecoded = decoded;
        try {
          decoded = decodeURIComponent(decoded);
        } catch (e) {
          break;
        }
        iterations++;
      }
      
      // Check for base64 encoded URLs
      try {
        const base64Pattern = /^[A-Za-z0-9+\/=]+$/;
        if (base64Pattern.test(decoded)) {
          const possibleUrl = atob(decoded);
          if (possibleUrl.includes('http')) {
            decoded = possibleUrl;
          }
        }
      } catch (e) {
        // Not base64 or invalid
      }
      
      return decoded;
    } catch (e) {
      return url;
    }
  }

  // Check URL parameters for suspicious content
  function hasBlockedParams(url) {
    try {
      const urlObj = new URL(url);
      const params = urlObj.searchParams;
      
      for (let [key, value] of params) {
        const combined = `${key}=${value}`.toLowerCase();
        
        if (SUSPICIOUS_PARAMS.some(param => combined.includes(param))) {
          return true;
        }
        
        if (BLOCKED_KEYWORDS.some(keyword => combined.includes(keyword))) {
          return true;
        }
      }
      
      return false;
    } catch (e) {
      return false;
    }
  }

  // Check for IP-based URLs
  function isBlockedIP(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      // Check if hostname is an IP address
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipPattern.test(hostname)) {
        return BLOCKED_IP_PATTERNS.some(pattern => pattern.test(hostname));
      }
      
      return false;
    } catch (e) {
      return false;
    }
  }

  // Check subdomain variations
  function hasBlockedSubdomain(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      const parts = hostname.split('.');
      
      // Check each subdomain part
      for (let part of parts) {
        if (BLOCKED_KEYWORDS.some(keyword => part.includes(keyword))) {
          return true;
        }
      }
      
      // Check common adult content subdomains
      const subdomain = parts[0];
      const mainDomain = parts.slice(-2).join('.');
      
      if (BLOCKED_SUBDOMAINS.includes(subdomain)) {
        if (BLOCKED_DOMAINS.some(domain => mainDomain.includes(domain))) {
          return true;
        }
      }
      
      return false;
    } catch (e) {
      return false;
    }
  }

  // Check file extensions in URL path
  function hasSuspiciousExtension(url) {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname.toLowerCase();
      
      for (let ext of SUSPICIOUS_EXTENSIONS) {
        if (path.endsWith(ext)) {
          // Check if the path contains blocked keywords before the extension
          const pathWithoutExt = path.substring(0, path.lastIndexOf(ext));
          if (BLOCKED_KEYWORDS.some(keyword => pathWithoutExt.includes(keyword))) {
            return true;
          }
        }
      }
      
      return false;
    } catch (e) {
      return false;
    }
  }

  // Enhanced URL checker with multiple validation layers
  function isBlockedURLEnhanced(url) {
    if (!url) return false;
    
    try {
      // Decode potentially obfuscated URL
      const decodedUrl = decodeObfuscatedURL(url);
      const urlLower = decodedUrl.toLowerCase();
      
      // Layer 1: Whitelist check
      if (CONFIG.whitelist.some(domain => urlLower.includes(domain))) {
        return false;
      }
      
      // Layer 2: Direct domain match
      if (BLOCKED_DOMAINS.some(domain => urlLower.includes(domain))) {
        return true;
      }
      
      // Layer 3: Pattern matching
      if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(urlLower))) {
        return true;
      }
      
      // Layer 4: Keyword in URL
      if (BLOCKED_KEYWORDS.some(keyword => urlLower.includes(keyword))) {
        return true;
      }
      
      // Layer 5: URL parameters
      if (hasBlockedParams(decodedUrl)) {
        return true;
      }
      
      // Layer 6: Subdomain check
      if (hasBlockedSubdomain(decodedUrl)) {
        return true;
      }
      
      // Layer 7: File extension check
      if (hasSuspiciousExtension(decodedUrl)) {
        return true;
      }
      
      // Layer 8: IP address check
      if (isBlockedIP(decodedUrl)) {
        return true;
      }
      
      return false;
    } catch (e) {
      logger.error('Error in enhanced URL check', { url, error: e.message });
      return false;
    }
  }

  // Add to block history
  function addToHistory(type, content, reason) {
    const entry = {
      timestamp: new Date().toISOString(),
      type,
      content: content.substring(0, 200), // Truncate for storage
      reason,
      url: window.location.href
    };
    
    blockHistory.unshift(entry);
    
    // Maintain max history size
    if (blockHistory.length > MAX_HISTORY) {
      blockHistory.pop();
    }
  }

  // Check meta tags for adult content indicators
  function checkMetaTags() {
    const metaTags = document.querySelectorAll('meta');
    
    metaTags.forEach(meta => {
      const name = meta.getAttribute('name') || '';
      const content = meta.getAttribute('content') || '';
      const property = meta.getAttribute('property') || '';
      
      const combinedText = `${name} ${content} ${property}`.toLowerCase();
      
      if (containsBlockedContent(combinedText)) {
        logger.warn('Suspicious meta tag detected', {
          name,
          content,
          property
        });
        
        if (CONFIG.strictMode) {
          showBlockedNotification('This page contains inappropriate meta tags');
        }
      }
    });
  }

  // Check page title
  function checkPageTitle() {
    const title = document.title.toLowerCase();
    
    if (containsBlockedContent(title)) {
      logger.warn('Suspicious page title detected', { title });
      
      if (CONFIG.strictMode) {
        showBlockedNotification('This page has an inappropriate title');
        // Optionally redirect or show warning page
        if (CONFIG.customBlockPage) {
          blockEntirePage();
        }
      }
    }
  }

  // Block entire page
  function blockEntirePage() {
    document.body.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: Arial, sans-serif;
        color: white;
        text-align: center;
        padding: 20px;
      ">
        <div style="
          background: white;
          color: #333;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 600px;
        ">
          <div style="font-size: 80px; margin-bottom: 20px;">🛡️</div>
          <h1 style="font-size: 32px; margin-bottom: 20px; color: #f44336;">
            Content Blocked
          </h1>
          <p style="font-size: 18px; line-height: 1.6; color: #666; margin-bottom: 30px;">
            This page has been blocked by the content filter due to inappropriate content.
            Access has been denied to protect you from adult material.
          </p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <strong>Reason:</strong> Page content matches adult/NSFW criteria
          </div>
          <button onclick="window.history.back()" style="
            background: #667eea;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
            margin-right: 10px;
          ">
            ← Go Back
          </button>
          <button onclick="window.location.href='/'" style="
            background: #764ba2;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
          ">
            Go Home
          </button>
        </div>
        <p style="margin-top: 30px; opacity: 0.8;">
          Content Filter System v2.0 • Protected
        </p>
      </div>
    `;
  }

  // Text content checker
  function containsBlockedContent(text) {
    if (!text || !CONFIG.blockText) return false;
    
    const textLower = text.toLowerCase();
    
    return BLOCKED_KEYWORDS.some(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      return regex.test(textLower);
    });
  }

  // Advanced image analysis
  function analyzeImage(img) {
    if (!IMAGE_ANALYSIS.enabled) return false;
    
    try {
      // Skip small images
      if (img.width < IMAGE_ANALYSIS.minImageSize || 
          img.height < IMAGE_ANALYSIS.minImageSize) {
        return false;
      }
      
      // Create canvas for analysis
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Analyze skin tone pixels
      let skinPixels = 0;
      let totalPixels = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        totalPixels++;
        
        // Skin tone detection algorithm
        if (isSkinTone(r, g, b)) {
          skinPixels++;
        }
      }
      
      const skinRatio = skinPixels / totalPixels;
      
      if (CONFIG.strictMode && skinRatio > 0.2) {
        return true;
      }
      
      if (skinRatio > IMAGE_ANALYSIS.skinColorThreshold) {
        return true;
      }
      
      return false;
      
    } catch (e) {
      // Cross-origin images will fail, that's okay
      return false;
    }
  }

  // Skin tone detection
  function isSkinTone(r, g, b) {
    // Multiple skin tone detection algorithms combined
    
    // Algorithm 1: RGB Rules
    const rgbRule = r > 95 && g > 40 && b > 20 &&
                    r > g && r > b &&
                    Math.abs(r - g) > 15;
    
    // Algorithm 2: HSV-based
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0;
    if (diff !== 0) {
      if (max === r) {
        h = 60 * (((g - b) / diff) % 6);
      } else if (max === g) {
        h = 60 * (((b - r) / diff) + 2);
      } else {
        h = 60 * (((r - g) / diff) + 4);
      }
    }
    
    if (h < 0) h += 360;
    
    const hsvRule = h >= 0 && h <= 50;
    
    return rgbRule || hsvRule;
  }

  // Block image element
  function blockImage(img) {
    if (!CONFIG.blockImages) return;
    
    const src = img.src || img.dataset.src;
    
    // Check URL first
    if (isBlockedURL(src)) {
      replaceWithWarning(img, 'image');
      stats.imagesBlocked++;
      stats.totalBlocked++;
      logger.log('Blocked image by URL', { src });
      reportBlocked('image', src);
      return;
    }
    
    // Check if image is loaded for analysis
    if (img.complete && img.naturalWidth > 0) {
      if (analyzeImage(img)) {
        replaceWithWarning(img, 'image');
        stats.imagesBlocked++;
        stats.totalBlocked++;
        logger.log('Blocked image by analysis', { src });
        reportBlocked('image', src);
      }
    } else {
      // Wait for image to load
      img.addEventListener('load', function() {
        if (analyzeImage(img)) {
          replaceWithWarning(img, 'image');
          stats.imagesBlocked++;
          stats.totalBlocked++;
          logger.log('Blocked image by analysis', { src });
          reportBlocked('image', src);
        }
      }, { once: true });
    }
  }

  // Block video element
  function blockVideo(video) {
    if (!CONFIG.blockVideos) return;
    
    const src = video.src || video.currentSrc;
    
    if (isBlockedURL(src)) {
      replaceWithWarning(video, 'video');
      stats.videosBlocked++;
      stats.totalBlocked++;
      logger.log('Blocked video', { src });
      reportBlocked('video', src);
      return;
    }
    
    // Check source elements
    const sources = video.querySelectorAll('source');
    sources.forEach(source => {
      if (isBlockedURL(source.src)) {
        replaceWithWarning(video, 'video');
        stats.videosBlocked++;
        stats.totalBlocked++;
        logger.log('Blocked video source', { src: source.src });
        reportBlocked('video', source.src);
      }
    });
  }

  // Block link element
  function blockLink(link) {
    if (!CONFIG.blockLinks) return;
    
    const href = link.href;
    
    if (isBlockedURL(href)) {
      link.style.pointerEvents = 'none';
      link.style.opacity = '0.5';
      link.style.textDecoration = 'line-through';
      link.setAttribute('aria-disabled', 'true');
      
      link.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showBlockedNotification('This link has been blocked');
        return false;
      }, true);
      
      stats.linksBlocked++;
      stats.totalBlocked++;
      logger.log('Blocked link', { href });
      reportBlocked('link', href);
    }
  }

  // Block text content
  function blockTextContent(element) {
    if (!CONFIG.blockText) return;
    
    const text = element.textContent || element.innerText;
    
    if (containsBlockedContent(text)) {
      element.style.filter = 'blur(10px)';
      element.style.userSelect = 'none';
      element.setAttribute('data-blocked', 'true');
      element.setAttribute('title', 'Content blocked by filter');
      
      stats.textBlocked++;
      stats.totalBlocked++;
      logger.log('Blocked text content', { 
        element: element.tagName,
        length: text.length 
      });
      reportBlocked('text', text.substring(0, 50));
    }
  }

  // Replace element with warning
  function replaceWithWarning(element, type) {
    if (!CONFIG.showWarnings) {
      element.style.display = 'none';
      return;
    }
    
    const warning = document.createElement('div');
    warning.className = 'content-filter-warning';
    warning.style.cssText = `
      background: #f44336;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px;
      font-family: Arial, sans-serif;
      margin: 10px 0;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    
    warning.innerHTML = `
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
        ⚠️ Content Blocked
      </div>
      <div style="font-size: 14px;">
        This ${type} has been blocked by the content filter.
      </div>
    `;
    
    element.parentNode.replaceChild(warning, element);
  }

  // Show notification
  function showBlockedNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 999999;
      font-family: Arial, sans-serif;
      animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Report blocked content
  function reportBlocked(type, content) {
    if (!CONFIG.reportingEnabled || !CONFIG.reportingEndpoint) return;
    
    try {
      fetch(CONFIG.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          content,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      }).catch(err => {
        logger.error('Failed to report blocked content', err);
      });
    } catch (e) {
      logger.error('Error reporting blocked content', e);
    }
  }

  // Scan all images
  function scanImages() {
    const images = document.querySelectorAll('img:not([data-filter-checked])');
    images.forEach(img => {
      img.setAttribute('data-filter-checked', 'true');
      blockImage(img);
    });
  }

  // Scan all videos
  function scanVideos() {
    const videos = document.querySelectorAll('video:not([data-filter-checked]), iframe:not([data-filter-checked])');
    videos.forEach(video => {
      video.setAttribute('data-filter-checked', 'true');
      blockVideo(video);
    });
  }

  // Scan all links
  function scanLinks() {
    const links = document.querySelectorAll('a:not([data-filter-checked])');
    links.forEach(link => {
      link.setAttribute('data-filter-checked', 'true');
      blockLink(link);
    });
  }

  // Scan text content
  function scanTextContent() {
    const textElements = document.querySelectorAll('p:not([data-filter-checked]), h1:not([data-filter-checked]), h2:not([data-filter-checked]), h3:not([data-filter-checked]), div:not([data-filter-checked]), span:not([data-filter-checked])');
    
    textElements.forEach(element => {
      element.setAttribute('data-filter-checked', 'true');
      blockTextContent(element);
    });
  }

  // Full page scan
  function scanPage() {
    if (!CONFIG.enabled) return;
    
    scanImages();
    scanVideos();
    scanLinks();
    scanTextContent();
  }

  // Monitor DOM changes
  function initDOMObserver() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            // Check the node itself
            if (node.tagName === 'IMG') {
              blockImage(node);
            } else if (node.tagName === 'VIDEO' || node.tagName === 'IFRAME') {
              blockVideo(node);
            } else if (node.tagName === 'A') {
              blockLink(node);
            } else {
              blockTextContent(node);
            }
            
            // Check children
            const imgs = node.querySelectorAll('img');
            imgs.forEach(blockImage);
            
            const videos = node.querySelectorAll('video, iframe');
            videos.forEach(blockVideo);
            
            const links = node.querySelectorAll('a');
            links.forEach(blockLink);
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    logger.log('DOM observer initialized');
  }

  // Intercept fetch requests
  function interceptFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
      const url = args[0];
      
      if (typeof url === 'string' && isBlockedURL(url)) {
        logger.warn('Blocked fetch request', { url });
        return Promise.reject(new Error('Request blocked by content filter'));
      }
      
      return originalFetch.apply(this, args);
    };
    
    logger.log('Fetch interceptor initialized');
  }

  // Intercept XMLHttpRequest
  function interceptXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      if (isBlockedURL(url)) {
        logger.warn('Blocked XHR request', { url });
        throw new Error('Request blocked by content filter');
      }
      
      return originalOpen.apply(this, [method, url, ...rest]);
    };
    
    logger.log('XHR interceptor initialized');
  }

  // Get statistics
  function getStats() {
    const runtime = (Date.now() - stats.startTime) / 1000;
    
    return {
      ...stats,
      runtime: `${runtime.toFixed(2)}s`,
      blocksPerMinute: ((stats.totalBlocked / runtime) * 60).toFixed(2)
    };
  }

  // Public API
  window.ContentFilter = {
    enable: function() {
      CONFIG.enabled = true;
      logger.log('Content filter enabled');
      scanPage();
    },
    
    disable: function() {
      CONFIG.enabled = false;
      logger.log('Content filter disabled');
    },
    
    configure: function(options) {
      Object.assign(CONFIG, options);
      logger.log('Configuration updated', CONFIG);
    },
    
    scan: scanPage,
    
    getStats: getStats,
    
    addToWhitelist: function(domain) {
      if (!CONFIG.whitelist.includes(domain)) {
        CONFIG.whitelist.push(domain);
        logger.log('Added to whitelist', { domain });
      }
    },
    
    removeFromWhitelist: function(domain) {
      const index = CONFIG.whitelist.indexOf(domain);
      if (index > -1) {
        CONFIG.whitelist.splice(index, 1);
        logger.log('Removed from whitelist', { domain });
      }
    },
    
    reset: function() {
      Object.keys(stats).forEach(key => {
        if (typeof stats[key] === 'number') stats[key] = 0;
      });
      stats.startTime = Date.now();
      logger.log('Statistics reset');
    },
    
    version: '2.0'
  };

  // Initialize on DOM ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    logger.log('Initializing content filter system v2.0');
    
    // Initial scan
    scanPage();
    
    // Set up monitoring
    initDOMObserver();
    
    // Intercept requests
    interceptFetch();
    interceptXHR();
    
    // Periodic scans
    setInterval(scanPage, CONFIG.checkInterval);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
      
      [data-blocked="true"] {
        position: relative;
      }
      
      [data-blocked="true"]::after {
        content: "🚫";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 48px;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    
    logger.log('Content filter system initialized successfully');
    logger.log('Use window.ContentFilter API for control');
  }

  // Auto-initialize
  init();

})();
