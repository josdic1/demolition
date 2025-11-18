# seed.py
from app import create_app
from app.extensions import db
from app.models import User, Genre, Status, Song, Link

def seed_database():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Users
        josh = User(name="Josh", email="joshuadicker@gmail.com")
        josh.set_password("1111")
        dor = User(name="Dor", email="dor@dor.com")
        dor.set_password("1111")
        db.session.add_all([josh, dor])

        # Genres
        rock = Genre(name="Rock")
        hiphop = Genre(name="Hip-Hop")
        edm = Genre(name="EDM")
        country = Genre(name="Country")
        punk = Genre(name="Punk")
        indie = Genre(name="Indie")
        pop = Genre(name="Pop")
        alternative = Genre(name="Alternative")
        db.session.add_all([rock, hiphop, edm, country, punk, indie, pop, alternative])

        # Statuses
        idea = Status(name="Idea")
        lyrics = Status(name="Lyrics")
        demo = Status(name="Demo")
        completed = Status(name="Completed")
        released = Status(name="Released")
        doh = Status(name="DOH")
        db.session.add_all([idea, lyrics, demo, completed, released, doh])

        db.session.flush()

        # Songs (30 real ones)
        song1 = Song(title="Afterglow", artist="Beautiful's Dream", about="A shimmering breakup anthem about finding peace in the pain of letting go.", bpm=88, key="E", lyrics="And in the afterglow, I found myself again\nDancing through the heartbreak, learning how to mend", user=josh, genre=indie, status=released)
        song2 = Song(title="Velvet Skies", artist="Beautiful's Dream", about="Ethereal love song painting romance under impossible purple and gold sunsets.", bpm=102, key="Ab", lyrics="We’re floating high where the velvet skies don’t end\nYour hand in mine, this is heaven, my friend", user=dor, genre=pop, status=completed)
        song3 = Song(title="Ghost Town Heart", artist="Beautiful's Dream", about="Haunting ballad about loving someone who’s emotionally checked out forever.", bpm=75, key="Dm", lyrics="This ghost town heart still beats for you\nEmpty streets and echoes of the truth", user=josh, genre=alternative, status=demo)
        song4 = Song(title="Neon Blood", artist="Patent Pending", about="Adrenaline-fueled rave anthem about living fast and burning twice as bright.", bpm=128, key="F#m", lyrics="Neon blood in my veins tonight\nWe don’t sleep, we just chase the lights", user=dor, genre=edm, status=released)
        song5 = Song(title="Emergency Exit", artist="Patent Pending", about="Breakneck pop-punk banger about escaping toxic situations at 100mph.", bpm=182, key="B", lyrics="Hit the gas, smash the glass, emergency exit\nI’m done with this, no regrets", user=josh, genre=punk, status=completed)
        song6 = Song(title="Sugar Rush Romance", artist="Patent Pending", about="Hyperactive crush song that feels like 3 energy drinks and a confession.", bpm=160, key="A", lyrics="You’re my sugar rush romance, 180 BPM heart\nCan’t slow down when this feeling starts", user=dor, genre=pop, status=lyrics)
        song7 = Song(title="Whiskey & Vinyl", artist="Dare County", about="Nostalgic bar anthem celebrating old records, cheap whiskey, and lost love.", bpm=85, key="G", lyrics="Put on that record, pour me one more\nWe’re spinning slow on this hardwood floor", user=josh, genre=country, status=released)
        song8 = Song(title="Backroad Baptism", artist="Dare County", about="Gritty coming-of-age story about finding salvation on empty county roads.", bpm=96, key="D", lyrics="Headlights cut the dark like a backroad baptism\nLord forgive me, I’m still sinning", user=dor, genre=rock, status=completed)
        song9 = Song(title="Basement Tapes", artist="Humble Beginnings", about="Lo-fi love letter to making music with friends in parents’ basements.", bpm=138, key="Em", lyrics="We wrote our dreams on basement tapes\nFour chords and a broken heart escape", user=josh, genre=indie, status=demo)
        song10 = Song(title="Cigarettes & Daydreams", artist="Humble Beginnings", about="Melancholic reflection on wasted youth and nicotine-stained memories.", bpm=112, key="Cm", lyrics="Cigarettes and daydreams, burning slow\nWe had the world but let it go", user=dor, genre=alternative, status=lyrics)
        song11 = Song(title="Atlas Shrugs", artist="The Forever Endeavor", about="Seven-minute emotional journey about carrying the weight of everyone’s expectations.", bpm=70, key="F", lyrics="I carried the world till my spine gave out\nAtlas shrugs and the sky falls down", user=josh, genre=alternative, status=completed)
        song12 = Song(title="Monuments", artist="The Forever Endeavor", about="Triumphant anthem about building something that outlives your name.", bpm=92, key="Bb", lyrics="We built monuments out of broken chords\nThese songs will stand when we’re dust and gone", user=dor, genre=rock, status=released)
        song13 = Song(title="Graveyard Shift", artist="Dickenz", about="Midnight trap banger about grinding while the world sleeps.", bpm=140, key="D#m", lyrics="I’m on the graveyard shift, demons pay my rent\nCashing checks written in blood and sweat", user=josh, genre=hiphop, status=released)
        song14 = Song(title="Porcelain Dolls", artist="Dickenz", about="Cold, cinematic track about fake people and fragile egos.", bpm=75, key="Fm", lyrics="Porcelain dolls with their plastic smiles crack\nOne wrong move and they never come back", user=dor, genre=hiphop, status=completed)
        song15 = Song(title="King of Ash", artist="Dickenz", about="Self-destructive victory lap from someone who won but lost everything.", bpm=66, key="Cm", lyrics="I’m the king of ash on a throne of smoke\nCrown’s too heavy but I’ll never choke", user=josh, genre=hiphop, status=doh)
        song16 = Song(title="Satellite Hearts", artist="Beautiful's Dream", about="Long-distance lovers connected only by late-night calls and shared playlists.", bpm=94, key="Gb", lyrics="We’re satellite hearts in a digital sky\n3,000 miles but I feel you tonight", user=dor, genre=indie, status=released)
        song17 = Song(title="Burn the Rulebook", artist="Patent Pending", about="Rebellious middle finger to industry gatekeepers and trends.", bpm=195, key="E", lyrics="Burn the rulebook, light the match\nWe don’t need permission to crash", user=josh, genre=punk, status=completed)
        song18 = Song(title="Devil’s Radio", artist="Dare County", about="Outlaw country tale about forbidden love broadcast on pirate frequencies.", bpm=78, key="A", lyrics="Tune in to the devil’s radio tonight\nShe’s singing sins in black and white", user=dor, genre=country, status=released)
        song19 = Song(title="Polaroid Ghosts", artist="Humble Beginnings", about="Nostalgic ode to faded photos and friends who moved away.", bpm=120, key="G", lyrics="Polaroid ghosts in my dresser drawers\nWe swore forever, now forever’s gone", user=josh, genre=indie, status=demo)
        song20 = Song(title="Eulogy for the Living", artist="The Forever Endeavor", about="Slow-burning dirge for dreams that died while you were still breathing.", bpm=68, key="Ebm", lyrics="This is the eulogy for the living\nStill walking but long gone within", user=dor, genre=alternative, status=lyrics)
        song21 = Song(title="Chrome Halo", artist="Dickenz", about="Cyber-trap flex about rising from nothing with ice in your veins.", bpm=150, key="F#", lyrics="Chrome halo, ice in my veins\nI was born in the fire, baptized in the rain", user=josh, genre=hiphop, status=completed)
        song22 = Song(title="Last Call Lullaby", artist="Beautiful's Dream", about="Bittersweet closing-time song you slow-dance to with a stranger.", bpm=100, key="Db", lyrics="This is the last call lullaby\nKiss me slow before we say goodbye", user=dor, genre=pop, status=released)
        song23 = Song(title="404", artist="Patent Pending", about="Glitchy drop monster made for warehouse raves at 4AM.", bpm=174, key="G#", lyrics="Error 404: feelings not found\nDrop the beat, burn it all down", user=josh, genre=edm, status=released)
        song24 = Song(title="Cornfield Cathedral", artist="Dare County", about="Rural gospel-punk hymn sung under stars in the middle of nowhere.", bpm=90, key="C", lyrics="Cornfield cathedral, moon for a steeple\nPraying to a God who forgot his people", user=dor, genre=country, status=completed)
        song25 = Song(title="Static & Silence", artist="Humble Beginnings", about="Love song transmitted through bad reception and worse timing.", bpm=105, key="Am", lyrics="You’re static and silence on a broken line\nBut I still hear music every single time", user=josh, genre=indie, status=demo)
        song26 = Song(title="Tidal", artist="The Forever Endeavor", about="Massive oceanic post-rock closer about surrender and rebirth.", bpm=82, key="B", lyrics="I let the tidal wave take me whole\nCame back new with an older soul", user=dor, genre=rock, status=released)
        song27 = Song(title="Red Ledger", artist="Dickenz", about="Dark confessional track listing every regret in perfect detail.", bpm=72, key="Gm", lyrics="Red ledger full of names I can’t erase\nEvery debt I owe written on my face", user=josh, genre=hiphop, status=doh)
        song28 = Song(title="Summer Never Ended", artist="Beautiful's Dream", about="Wistful summer romance that somehow lasted forever.", bpm=110, key="F", lyrics="September came but the summer never ended\nWe just kept pretending", user=dor, genre=indie, status=released)
        song29 = Song(title="404 Heart Not Found", artist="Patent Pending", about="Chaotic breakup song for the digital age.", bpm=188, key="A", lyrics="404 heart not found, server down\nGuess I’ll scream into the void now", user=josh, genre=punk, status=completed)
        song30 = Song(title="Moonshine Messiah", artist="Dare County", about="Outlaw preacher with a bottle and a bible made of lies.", bpm=84, key="D", lyrics="Moonshine messiah with a crooked grin\nSaving souls and damning them again", user=dor, genre=country, status=released)

        db.session.add_all([song1, song2, song3, song4, song5, song6, song7, song8, song9, song10,
                            song11, song12, song13, song14, song15, song16, song17, song18, song19, song20,
                            song21, song22, song23, song24, song25, song26, song27, song28, song29, song30])

        db.session.commit()
        print("Seed complete — 2 users, 8 genres, 6 statuses, 30 real songs. Done.")

if __name__ == "__main__":
    seed_database()