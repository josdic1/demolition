from app import create_app
from app.extensions import db
from app.models import User, Status, Genre, Song, Link

def seed_database():
    app = create_app()
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        
        print("Clearing database...")
        try:
            Link.query.delete()
            Song.query.delete()
            Genre.query.delete()
            Status.query.delete()
            User.query.delete()
            db.session.commit()
        except Exception as e:
            print(f"Error clearing: {e}")
            db.session.rollback()

        print("Creating users...")
        josh = User(name="Josh", email="joshuadicker@gmail.com")
        josh.set_password("password123")
        dor = User(name="Dor", email="dor@dor.com")
        dor.set_password("password123")
        db.session.add_all([josh, dor])
        db.session.commit()

        print("Creating statuses...")
        idea = Status(name="Idea")
        lyrics = Status(name="Lyrics")
        demo = Status(name="Demo")
        completed = Status(name="Completed")
        released = Status(name="Released")
        doh = Status(name="DOH")
        db.session.add_all([idea, lyrics, demo, completed, released, doh])
        db.session.commit()

        print("Creating genres...")
        rock = Genre(name="Rock")
        hip_hop = Genre(name="Hip-Hop")
        edm = Genre(name="EDM")
        country = Genre(name="Country")
        punk = Genre(name="Punk")
        indie = Genre(name="Indie")
        pop = Genre(name="Pop")
        alternative = Genre(name="Alternative")
        db.session.add_all([rock, hip_hop, edm, country, punk, indie, pop, alternative])
        db.session.commit()

        print("Creating songs...")
        
        songs_data = [
            {"title": "Sleep It Off", "artist": "Humble Beginnings", "about": "Track 2 from 'Overanalyzing the Manifestations of the Unconscious' (1998)", "key": "C", "links": [("Apple Music", "https://music.apple.com/us/album/sleep-it-off/1740203014?i=1740203017")]},
            {"title": "Laughing With Your Friends", "artist": "Humble Beginnings", "about": "Track 3 from 'Overanalyzing the Manifestations of the Unconscious' (1998)", "key": "A", "links": [("Apple Music", "https://music.apple.com/us/song/laughing-with-your-friends/1740203018")]},
            {"title": "Three Thirty Four", "artist": "Humble Beginnings", "about": "Track 1 from 'Overanalyzing the Manifestations of the Unconscious' (1998)", "key": "F", "links": [("Spotify", "https://open.spotify.com/track/1RYVRmUvHQcqgMOgUu6YZg"), ("Apple Music", "https://music.apple.com/us/song/three-thirty-four/1740203015")]},
            {"title": "Afterall", "artist": "Humble Beginnings", "about": "Track 4 from 'Overanalyzing the Manifestations of the Unconscious' (1998)", "key": "D", "links": [("Apple Music", "https://music.apple.com/us/song/afterall/1740203019"), ("Spotify", "https://open.spotify.com/track/3mY6YE8IUFQEVItcDaDl9C")]},
            {"title": "Activate", "artist": "Humble Beginnings", "about": "Track 5 from 'Overanalyzing the Manifestations of the Unconscious' (1998)", "key": "C", "links": [("Spotify", "https://open.spotify.com/track/3KSiwFaSQwXlnYxMaxW6Wi"), ("Apple Music", "https://music.apple.com/us/song/activate/1740203020")]},
            {"title": "Faith 98", "artist": "Humble Beginnings", "about": "Track 6 from 'Overanalyzing the Manifestations of the Unconscious' (1998)", "key": "B", "links": [("Spotify", "https://open.spotify.com/track/1eUtaonEYkKAsmt24DtxLB"), ("Apple Music", "https://music.apple.com/us/song/faith-98/1740203021")]},
            {"title": "America's Funniest Home Videos", "artist": "Humble Beginnings", "about": "From their tape 'A Promotional Tape Just For You' (5 Songs)(1997)", "key": "E", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-americas-funniest")]},
            {"title": "Got It", "artist": "Humble Beginnings", "about": "From their tape 'A Promotional Tape Just For You' (5 Songs)(1997)", "key": "G", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-got-it")]},
            {"title": "Anthem of a Young Republican", "artist": "Humble Beginnings", "about": "From their tape 'A Promotional Tape Just For You' (5 Songs) (1997)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-anthem")]},
            {"title": "Shelter", "artist": "Humble Beginnings", "about": "From their tape 'A Promotional Tape Just For You' (5 Songs)(1997)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-shelter")]},
            {"title": "I See Clearly", "artist": "Humble Beginnings", "about": "From their '5 Song Demo Tape' (1997)", "key": "F#", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-i-see-clearly")]},
            {"title": "Oh Donna", "artist": "Humble Beginnings", "about": "From their '5 Song Demo Tape' (1997)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-oh-donna")]},
            {"title": "16 Years Down", "artist": "Humble Beginnings", "about": "From their '5 Song Demo Tape' (1997)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-16-years-down")]},
            {"title": "Gone Tomorrow", "artist": "Humble Beginnings", "about": "From their split 7 Inch w/ Oblivion (1997)", "key": "G", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-gone-tomorrow"), ("Other", "https://www.discogs.com/release/4159757-Oblivion-12-Humble-Beginnings-Oblivion-Humble-Beginnings")]},
            {"title": "We Don't Want It", "artist": "Humble Beginnings", "about": "From their split 7 Inch w/ Oblivion (1997)", "key": "F", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-we-dont-want-it")]},
            {"title": "All That Way", "artist": "Humble Beginnings", "about": "From their split 7 Inch 'Age & Experience Vs Young & Cunning' (1999)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-all-that-way-2")]},
            {"title": "Promise", "artist": "Humble Beginnings", "about": "From their split 7 Inch 'Age & Experience Vs Young & Cunning' (1999)", "key": "D", "links": [("Other", "https://www.discogs.com/release/2285338-Bracket-Humble-Beginnings-Age-Experience-Vs-Youth-Cunning"), ("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-promise")]},
            {"title": "1987", "artist": "Humble Beginnings", "about": "From their split 7 Inch 'Age & Experience Vs Young & Cunning' (1999)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-1987")]},
            {"title": "What Else Is There", "artist": "Humble Beginnings", "about": "From their split 7 Inch 'Age & Experience Vs Young & Cunning' (1999)", "key": "A", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-what-else-is-there")]},
            {"title": "A Day at the Races", "artist": "Humble Beginnings", "about": "From their split 7 Inch 'Age & Experience Vs Young & Cunning' (1999)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-a-day-at-the-races")]},
            {"title": "Southern California", "artist": "Humble Beginnings", "about": "From their EP 'Southern California' (2001)", "key": "A#", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-southern-california-1"), ("Other", "https://www.discogs.com/release/12105895-Humble-Beginnings-Southern-California")]},
            {"title": "Faith 68", "artist": "Humble Beginnings", "about": "From their EP 'Southern California' (2001)", "key": "C", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-faith-69")]},
            {"title": "Angel Forever", "artist": "Humble Beginnings", "about": "From their EP 'Southern California' (2001)", "key": "Ab", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-angel-forever-1")]},
            {"title": "Breakdown", "artist": "Humble Beginnings", "about": "From their EP 'Southern California' (2001)", "key": "C", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/breakdown")]},
            {"title": "Together", "artist": "Humble Beginnings", "about": "From their EP 'We Wear Vans' (2000)", "key": "Am", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-together"), ("Other", "https://www.discogs.com/release/13805226-Humble-Beginnings-We-Wear-Vans")]},
            {"title": "Holding On", "artist": "Humble Beginnings", "about": "From their EP 'We Wear Vans' (2000)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-holding-on")]},
            {"title": "Taking the Long Way Home", "artist": "Humble Beginnings", "about": "From their EP 'We Wear Vans' (2000)", "key": "Am", "links": []},
            {"title": "Downside of Pride", "artist": "Humble Beginnings", "about": "From their EP 'We Wear Vans' (2000)", "key": "A", "links": []},
            {"title": "Nowhere With Me", "artist": "Humble Beginnings", "about": "From their tape 'Spontaneous Combustion' (1996)", "key": "F#m", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-nowhere-with-me")]},
            {"title": "Fat Bill", "artist": "Humble Beginnings", "about": "From their tape 'Spontaneous Combustion' (1996)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-fat-bill")]},
            {"title": "Advocates and Adversaries", "artist": "Humble Beginnings", "about": "From their tape 'Spontaneous Combustion' (1996)", "key": "C", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-advocates-and-adversaries")]},
            {"title": "Poster People", "artist": "Humble Beginnings", "about": "From their tape 'Spontaneous Combustion' (1996)", "key": "F#m", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-poster-people")]},
            {"title": "Jerry", "artist": "Humble Beginnings", "about": "From their tape 'Spontaneous Combustion' (1996)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-jerry-live")]},
            {"title": "I Tried So Hard", "artist": "Humble Beginnings", "about": "From their tape 'Spontaneous Combustion' (1996)", "key": "G#m", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-i-tried-so-hard-live")]},
            {"title": "Scavenger Type", "artist": "Humble Beginnings", "about": "From their tape 'Spontaneous Combustion' (1996)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/humble-beginnings-scavengertype")]},
            {"title": "Kappa Dirty", "artist": "The Forever Endeavor", "about": "From their EP 'We Win When You Break' (2002)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-kappa-dirty")]},
            {"title": "Sarah", "artist": "The Forever Endeavor", "about": "From their EP 'We Win When You Break' (2002)", "key": "A", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-sarah")]},
            {"title": "Rock Band", "artist": "The Forever Endeavor", "about": "From their EP 'We Win When You Break' (2002)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-rock-band")]},
            {"title": "The Old Sound", "artist": "The Forever Endeavor", "about": "From their EP 'We Win When You Break' (2002)", "key": "F#m", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-the-old-sound")]},
            {"title": "The Phi Eps", "artist": "The Forever Endeavor", "about": "From their EP 'We Win When You Break' (2002)", "key": "A", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-the-phi-eps")]},
            {"title": "The Counterlife", "artist": "The Forever Endeavor", "about": "From their EP 'We Win When You Break' (2002)", "key": "B", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-the-counter-life")]},
            {"title": "The Forever Endeavor", "artist": "The Forever Endeavor", "about": "From their EP 'We Win When You Break' (2002)", "key": "B", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-the-forever-endeavor")]},
            {"title": "A Weekend or a Year", "artist": "The Forever Endeavor", "about": "From 'Ills Of The Underground' (Split CD w/ Patent Pending & The Rookie) (2003)", "key": "F", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-a-weekend-or-a-year"), ("Other", "https://www.discogs.com/release/22698716-The-Rookie-3Forever-Endeavor-Patent-Pending-Ills-Of-The-Underground")]},
            {"title": "Timeline Divided", "artist": "The Forever Endeavor", "about": "From 'Ills Of The Underground' (Split CD w/ Patent Pending & The Rookie) (2003)", "key": "A", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-timeline-divided")]},
            {"title": "The Bear", "artist": "The Forever Endeavor", "about": "From 'Ills Of The Underground' (Split CD w/ Patent Pending & The Rookie) (2003)", "key": "A", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-the-bear")]},
            {"title": "The Fall Thaw", "artist": "The Forever Endeavor", "about": "From the 'Boiler Room Demo' EP (2004)", "key": "A#", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-the-fall-thaw")]},
            {"title": "In Harmony", "artist": "The Forever Endeavor", "about": "From the 'Boiler Room Demo' EP (2004)", "key": "A", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-in-harmony")]},
            {"title": "Some Boys", "artist": "The Forever Endeavor", "about": "From their EP 'Some Boys' (2006)", "key": "A#", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-some-boys")]},
            {"title": "Thrills of the Underground", "artist": "The Forever Endeavor", "about": "From their EP 'Some Boys' (2006)", "key": "G#m", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-thrills-of-the-underground")]},
            {"title": "Push Pull", "artist": "The Forever Endeavor", "about": "From their album 'Culture AD' (2007)", "key": "F#m", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-push-pull")]},
            {"title": "Starving in the Garden State", "artist": "The Forever Endeavor", "about": "From their album 'Culture AD' (2007)", "key": "G#", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-starvin-in-the-garden-state")]},
            {"title": "Hands Lace In July", "artist": "The Forever Endeavor", "about": "From their album 'Culture AD' (2007)", "key": "A", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-hands-lace-in-july")]},
            {"title": "Hell Ride", "artist": "The Forever Endeavor", "about": "From their album 'Culture AD' (2007)", "key": "F#m", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-hell-ride")]},
            {"title": "May Day", "artist": "The Forever Endeavor", "about": "From their album 'Culture AD' (2007)", "key": "A", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-may-day")]},
            {"title": "Maria Ave", "artist": "The Forever Endeavor", "about": "From their album 'Culture AD' (2007)", "key": "Dm", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-maria-ave")]},
            {"title": "Kelifornia", "artist": "The Forever Endeavor", "about": "From their album 'Culture AD' (2007)", "key": "D", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-kellifornia")]},
            {"title": "Beta Chain", "artist": "The Forever Endeavor", "about": "From their album 'Culture AD' (2007)", "key": "A#", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-beta-chain")]},
            {"title": "Boom For Real", "artist": "The Forever Endeavor", "about": "From their album 'Culture AD' (2007)", "key": "G#m", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-boom-for-real")]},
            {"title": "Lay It Down", "artist": "The Forever Endeavor", "about": "From their album 'Culture AD' (2007)", "key": "F#m", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-lay-it-down")]},
            {"title": "And To Earth Return", "artist": "The Forever Endeavor", "about": "From their album 'Culture AD' (2007)", "key": "F#m", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-and-to-earth-you-will-return")]},
            {"title": "Timeless Reminder", "artist": "The Forever Endeavor", "about": "From their album 'Culture AD' (2007)", "key": "F#m", "links": [("SoundCloud", "https://soundcloud.com/njpparchives/the-forever-endeavor-timeless-reminder")]},
            {"title": "Lights Out In Mississippi", "artist": "Patent Pending", "about": "From the album 'Save Each Other, The Whales Are Doing Fine' (2006)", "key": "A", "links": [("Other", "https://www.discogs.com/release/3664211-Patent-Pending-Save-Each-OtherWhales-Are-Doing-Fine")]},
            {"title": "This Can't Happen Again", "artist": "Patent Pending", "about": "From the album 'Save Each Other, The Whales Are Doing Fine' (2006)", "key": "A", "links": []},
            {"title": "Old And Out Of Tune", "artist": "Patent Pending", "about": "From the album 'Save Each Other, The Whales Are Doing Fine' (2006)", "key": "A", "links": []},
            {"title": "The Safety Of Sleeping In", "artist": "Patent Pending", "about": "From the album 'Save Each Other, The Whales Are Doing Fine' (2006)", "key": None, "links": []},
            {"title": "The L-Town Shakedown", "artist": "Patent Pending", "about": "From the album 'Save Each Other, The Whales Are Doing Fine' (2006)", "key": None, "links": []},
            {"title": "Robert Ragosta Is A Ringtone", "artist": "Patent Pending", "about": "From the album 'Save Each Other, The Whales Are Doing Fine' (2006)", "key": None, "links": []},
            {"title": "Samantha The Great", "artist": "Patent Pending", "about": "From the album 'Save Each Other, The Whales Are Doing Fine' (2006)", "key": None, "links": []},
            {"title": "Sleep Well My Angel", "artist": "Patent Pending", "about": "From the album 'Save Each Other, The Whales Are Doing Fine' (2006)", "key": None, "links": []},
            {"title": "Douchebag", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": "A", "links": [("Other", "https://www.discogs.com/master/612319-Patent-Pending-Second-Family")]},
            {"title": "I Already Know", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": None, "links": []},
            {"title": "Shake Weights And Moving Crates", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": None, "links": []},
            {"title": "Cut Copy Paste", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": None, "links": []},
            {"title": "Little Miss Impossible", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": None, "links": []},
            {"title": "We're Freaking Out", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": None, "links": []},
            {"title": "Memory", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": None, "links": []},
            {"title": "Set The Sun On Fire", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": None, "links": []},
            {"title": "This Love Can Save Us All", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": None, "links": []},
            {"title": "Spin Me Around", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": None, "links": []},
            {"title": "Valentine", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": None, "links": []},
            {"title": "Second Family", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": None, "links": []},
            {"title": "One Less Heart To Break", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": None, "links": []},
            {"title": "Dance Till We Die", "artist": "Patent Pending", "about": "From the album 'Second Family' (2011)", "key": None, "links": []},
            {"title": "Brighter", "artist": "Patent Pending", "about": "From their album 'Brighter' (2013)", "key": "F#m", "links": [("Other", "https://www.discogs.com/release/5039995-Patent-Pending-Brighter")]},
            {"title": "All-Star Hipster", "artist": "Patent Pending", "about": "From their album 'Brighter' (2013)", "key": None, "links": []},
            {"title": "Anti-Everything", "artist": "Patent Pending", "about": "From their album 'Attack of the Awesome' (2009)", "key": "A#", "links": [("Other", "https://www.discogs.com/release/1884512-Patent-Pending-Attack-Of-The-Awesome")]},
            {"title": "The Way You Make Me Shake", "artist": "Patent Pending", "about": "From their EP 'Attack of the Awesome' (2009)", "key": "G", "links": []},
            {"title": "Drop Dead", "artist": "Patent Pending", "about": "From their EP 'Attack of the Awesome' (2009)", "key": None, "links": []},
            {"title": "Sunset Summer", "artist": "Patent Pending", "about": "From their EP 'Attack of the Awesome' (2009)", "key": None, "links": []},
            {"title": "Hey Six", "artist": "Patent Pending", "about": "From their EP 'Attack of the Awesome' (2009)", "key": None, "links": []},
            {"title": "Therefore, I Party", "artist": "Patent Pending", "about": "From their EP 'Attack of the Awesome' (2009)", "key": None, "links": []},
            {"title": "She's A Ho Ho Ho", "artist": "Patent Pending", "about": "From their single 'She's A Ho Ho Ho' (2007)", "key": None, "links": [("Other", "https://www.discogs.com/release/11230605-Patent-Pending-Shes-A-Ho-Ho-Ho-Merry-Christmas")]},
            {"title": "Pools are Made for Hopping", "artist": "Patent Pending", "about": "From their single 'Pools are Made for Hopping' (2013)", "key": "A#", "links": []},
            {"title": "Walk-In Closet", "artist": "Patent Pending", "about": "From their EP 'I'm Not Alone' (2010)", "key": "A", "links": []},
            {"title": "I'm Not Alone", "artist": "Patent Pending", "about": "From their EP 'I'm Not Alone' (2010)", "key": None, "links": []},
            {"title": "She Only Wants My Blood", "artist": "Patent Pending", "about": "From their EP 'I'm Not Alone' (2010)", "key": None, "links": []},
            {"title": "Air Underneath My Feet", "artist": "Patent Pending", "about": "From their EP 'I'm Not Alone' (2010)", "key": None, "links": []},
            {"title": "Worth the Wounds", "artist": "Dickenz", "about": "From the EP 'Worth the Wounds' (2009)", "key": "A", "links": []},
            {"title": "Stay Gone", "artist": "Dickenz", "about": "From the EP 'Worth the Wounds' (2009)", "key": "G#m", "links": []},
            {"title": "True Believer", "artist": "Dickenz", "about": "From the EP 'Worth the Wounds' (2009)", "key": None, "links": []},
            {"title": "Hold On Laurie", "artist": "Dickenz", "about": "From the EP 'Worth the Wounds' (2009)", "key": "F#m", "links": []},
            {"title": "Always Enough", "artist": "Dickenz", "about": "From the EP 'Worth the Wounds' (2009)", "key": "F#m", "links": []},
            {"title": "Wings of an Eagle", "artist": "Dickenz", "about": "From the EP 'Jersey Tuff' (2010)", "key": None, "links": []},
            {"title": "Spirit of the Warrior", "artist": "Dickenz", "about": "From the EP 'Jersey Tuff' (2010)", "key": None, "links": []},
            {"title": "Roundhouse to the Heart", "artist": "Dickenz", "about": "From the EP 'Jersey Tuff' (2010)", "key": None, "links": []},
            {"title": "Sound Beach", "artist": "Dickenz", "about": "From the EP 'Low Country High' (2013)", "key": "F#m", "links": []},
            {"title": "Stumble and Fade", "artist": "Dickenz", "about": "From the EP 'The Johny Split' (2006)", "key": None, "links": []},
            {"title": "Living Like", "artist": "Dare County", "about": "From the EP 'Dare County' (2018)", "key": None, "links": []},
            {"title": "Buddy", "artist": "Dare County", "about": "From the EP 'Dare County' (2018)", "key": "F#m", "links": []},
            {"title": "Farmland and Heartbreak", "artist": "Dare County", "about": "From the EP 'Dare County' (2018)", "key": "F#m", "links": []},
            {"title": "Pickup Artist", "artist": "Dare County", "about": "From the EP 'Dare County' (2018)", "key": None, "links": [("Spotify", "https://open.spotify.com/track/0t7yvXwjhBbyEIsGiRtQTc")]},
            {"title": "Worth the Wounds", "artist": "Dare County", "about": "Single release on Severman Records (2023)", "key": None, "links": [("Spotify", "https://open.spotify.com/track/3m0xMbqIRyBzX5JfYcml0k")]},
            {"title": "Stay Gone", "artist": "Dare County", "about": "Single release on Severman (2024)", "key": None, "links": [("Spotify", "https://open.spotify.com/track/1AGUOXqAk2zvrefMEfGUJb")]},
            {"title": "Living Like", "artist": "Dare County", "about": "Single release on Seal Network (2022)", "key": None, "links": [("Spotify", "https://open.spotify.com/album/4ipVvhLMpuuCT8EGgUXWbr")]},
            {"title": "Gravity", "artist": "Dare County", "about": "Single self-release (2022)", "key": None, "links": [("Spotify", "https://open.spotify.com/album/0t371DGJTQ4KWkweyyZsUW")]},
            {"title": "Come Running", "artist": "Dare County", "about": "Track completed with Aaron Kruk (2024)", "key": None, "links": []},
            {"title": "Blink Shirt", "artist": "TRPX", "about": "From the Album 'Grenadine' (2021)", "key": None, "links": []},
            {"title": "All Aboard", "artist": "TRPX", "about": "From the Album 'Grenadine' (2021)", "key": None, "links": []},
            {"title": "Getting Better", "artist": "TRPX", "about": "From the Album 'Grenadine' (2021)", "key": None, "links": []},
            {"title": "Full Bullshit", "artist": "TRPX", "about": "From the Album 'Grenadine' (2021)", "key": None, "links": []},
            {"title": "Anarchy in the NJ", "artist": "TRPX", "about": "From the Album 'Grenadine' (2021)", "key": None, "links": []},
            {"title": "When You Were Still Mine", "artist": "TRPX", "about": "From the Album 'Grenadine' (2021)", "key": None, "links": []},
            {"title": "Ironbound", "artist": "TRPX", "about": "From the Album 'Grenadine' (2021)", "key": None, "links": []},
            {"title": "Come Running", "artist": "TRPX", "about": "From the Album 'Grenadine' (2021)", "key": None, "links": []},
            {"title": "Drive Off", "artist": "TRPX", "about": "From the Album 'Grenadine' (2021)", "key": None, "links": []},
            {"title": "Gravity", "artist": "TRPX", "about": "From the Album 'Grenadine' (2021)", "key": None, "links": []},
            {"title": "Whipped Cream Hair", "artist": "Beautiful's Dream", "about": "Single (2025)", "key": None, "links": [("Spotify", "https://open.spotify.com/track/5eVwDcQ91ytQuZ69vFIJhP")]},
            {"title": "Back to the Tractor", "artist": "Dare County", "about": "From the EP 'Dare County' (2018)", "key": None, "links": []},
            {"title": "Hell Yeah (got ur number)", "artist": "Dickenz", "about": "From the EP 'Jersey Tuff' (2011)", "key": None, "links": [("YouTube", "https://www.youtube.com/watch?v=nL6_T57HxcA")]},
        ]

        # Create all songs and links
        for song_data in songs_data:
            song = Song(
                title=song_data["title"],
                artist=song_data["artist"],
                about=song_data["about"],
                lyrics=None,
                bpm=None,
                key=song_data.get("key"),
                user=josh,
                genre=punk,
                status=released
            )
            db.session.add(song)
            db.session.commit()
            
            # Add links for this song
            for link_type, link_url in song_data["links"]:
                link = Link(url_type=link_type, url_link=link_url, song=song)
                db.session.add(link)
            
            db.session.commit()

        print("✅ Database seeded successfully!")
        print(f"Created {User.query.count()} users")
        print(f"Created {Status.query.count()} statuses")
        print(f"Created {Genre.query.count()} genres")
        print(f"Created {Song.query.count()} songs")
        print(f"Created {Link.query.count()} links")


if __name__ == '__main__':
    seed_database()
