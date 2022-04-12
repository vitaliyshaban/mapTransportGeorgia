dataObjEdite = {
	"newObj": {},
	"editObj": {},
	"deletedObj": {}
};

const saveData = {
	getSave: function() {
		return dataObjEdite;
	},
	setSave: function(data) {
		dataObjEdite.push(data);
	}
}

module.exports = saveData;