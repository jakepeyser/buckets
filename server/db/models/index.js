const Goal = require('./goal');

// Form the associations

// Song.belongsTo(Album);
// Album.hasMany(Song);
// Album.belongsTo(Artist); // "Album Artist" is a thing, even if there are
//                          // other artists on the album.


// Artist.belongsToMany(Song, { through: 'artistSong' });
// Song.belongsToMany(Artist, { through: 'artistSong' });

// Song.belongsToMany(Playlist, { through: 'playlistSong' });
// Playlist.belongsToMany(Song, { through: 'playlistSong' });

module.exports = {
  Goal
};
