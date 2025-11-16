const output = document.getElementById('output');
const dataStream = document.getElementById('data-stream');

function addOutput(text) {
    output.textContent += '\n> ' + text;
    output.scrollTop = output.scrollHeight;
}

function addToDataStream(text) {
    dataStream.textContent += '\n' + text;
    dataStream.scrollTop = dataStream.scrollHeight;
}

async function showAllSongs() {
    addOutput('Fetching all songs...');
    addToDataStream('> FETCHING ALL SONGS...');
    try {
        const response = await fetch('http://localhost:5555/songs');
        const data = await response.json();
        addOutput(`Retrieved ${data.length} songs`);
        addToDataStream(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
        addToDataStream('ERROR: ' + error.message);
    }
}

async function showAllArtists() {
    addOutput('Fetching all artists...');
    addToDataStream('> FETCHING ALL ARTISTS...');
    try {
        const response = await fetch('http://localhost:5555/artists');
        const data = await response.json();
        addOutput(`Retrieved ${data.length} artists`);
        addToDataStream(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
        addToDataStream('ERROR: ' + error.message);
    }
}

async function showAllGenres() {
    addOutput('Fetching all genres...');
    addToDataStream('> FETCHING ALL GENRES...');
    try {
        const response = await fetch('http://localhost:5555/genres');
        const data = await response.json();
        addOutput(`Retrieved ${data.length} genres`);
        addToDataStream(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
        addToDataStream('ERROR: ' + error.message);
    }
}

async function showAllStatuses() {
    addOutput('Fetching all statuses...');
    addToDataStream('> FETCHING ALL STATUSES...');
    try {
        const response = await fetch('http://localhost:5555/statuses');
        const data = await response.json();
        addOutput(`Retrieved ${data.length} statuses`);
        addToDataStream(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
        addToDataStream('ERROR: ' + error.message);
    }
}

async function seedDB() {
    if (!confirm('This will seed the database. Continue?')) return;
    addOutput('Seeding database...');
    addToDataStream('> SEEDING DATABASE...');
    try {
        const response = await fetch('http://localhost:5555/seed', {
            method: 'POST'
        });
        const data = await response.json();
        addOutput('Database seeded');
        addToDataStream(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
        addToDataStream('ERROR: ' + error.message);
    }
}

async function updateSeedFile() {
    if (!confirm('This will overwrite seed.py with current database. Continue?')) return;
    addOutput('Refreshing seed file...');
    addToDataStream('> REFRESHING SEED FILE...');
    try {
        const response = await fetch('http://localhost:5555/update-seed', {
            method: 'POST'
        });
        const data = await response.json();
        addOutput('Seed file refreshed');
        addToDataStream(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
        addToDataStream('ERROR: ' + error.message);
    }
}

function clearScreen() {
    output.textContent = '> System Ready...';
    dataStream.textContent = '> DATA STREAM INITIALIZED\n> MONITORING...';
}

async function nukeDB() {
    if (!confirm('⚠️ This will delete ALL data! Continue?')) return;
    addOutput('NUKING DATABASE...');
    addToDataStream('> NUKE INITIATED...');
    try {
        const response = await fetch('http://localhost:5555/nuke', {
            method: 'POST'
        });
        const data = await response.json();
        addOutput('Database nuked');
        addToDataStream(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
        addToDataStream('ERROR: ' + error.message);
    }
}

async function removeDB() {
    if (!confirm('⚠️ DANGER: This will delete the database file! Continue?')) return;
    addOutput('REMOVING DATABASE FILE...');
    addToDataStream('> RM INSTANCE/DEMOLITION.DB...');
    try {
        const response = await fetch('http://localhost:5555/remove-db', {
            method: 'POST'
        });
        const data = await response.json();
        addOutput('Database file removed');
        addToDataStream(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
        addToDataStream('ERROR: ' + error.message);
    }
}

function updateTimestamp() {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const element = document.getElementById('timestamp');
    if (element) {
        element.textContent = `TIMESTAMP: ${timestamp} UTC`;
    }
}

async function updateSongCount() {
    try {
        const response = await fetch('http://localhost:5555/songs');
        const data = await response.json();
        const countElement = document.getElementById('song-count');
        if (countElement) {
            countElement.textContent = data.length;
        }
    } catch (error) {
        console.error('Failed to update song count');
    }
}

updateTimestamp();
updateSongCount();
setInterval(updateTimestamp, 1000);
// setInterval(updateSongCount, 5000);