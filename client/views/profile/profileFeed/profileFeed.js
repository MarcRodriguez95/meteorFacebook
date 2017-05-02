
/**
* @isMethod true
* @memberOf Method
* @function onCreated
* @summary Es el metodo relacionado con las historias del perfil del usuario especificado.
* @locus profileFeed
* @param {Object} [username] nombre del usuario.
*/
Template.profileFeed.onCreated(function(){
    var self = this;
	/**
	* @isMethod true
	* @memberOf Method
	* @function autorun
	* @summary Es el metodo con el que se suscribe las historias del mismo perfil del usuario especificado.
	* @locus profileFeed
	* @param {Object} [username] nombre del usuario especificado.
	*/
    Tracker.autorun(function(){
        var username = Router.current().params.username;
        self.subscribe("profileStories", username);
    })

})

/**
* @isMethod true
* @memberOf Method
* @function events
* @summary Template donde se almacenan los eventos que pueden ocurrir en profileFeed, y lo que se debe hacer en caso de llamarlos.
* @locus profileFeed
*/
Template.profileFeed.events({
	/**
	* @isMethod true
	* @memberOf Method
	* @summary Es el metodo con el que se crea las historias del perfil del usuario especificado.
	* @locus profileFeed
	* @param {Object} [profileUser] nombre del usuario, con firstname y lastname.
	* @param {Object} [currentUser] usuario que actualmente esta en activo.
	* @param {Object} [story] recoge el valor que se le aplica cuando se crea un nuevo post para la historia.
	*/
    'click .new-post':function(e){
        e.preventDefault();
        var profileUser = Meteor.users.findOne({username:Router.current().params.username});
        var currentUser = Meteor.user();
        var story = $('textarea[name="new-post"]').val();
        if(story.length) {

            Stories.insert({
                createdBy: currentUser._id,
                createdFor: profileUser._id,
                userImage: currentUser.profile.picture.thumbnail,
                storyImage: null,
                storyText: story,
                creatorName: currentUser.profile.name.first + " " + currentUser.profile.name.last,
                creatorUsername: currentUser.profile.login.username,
                creatorThumbnail: currentUser.profile.picture.thumbnail,
                createdForName: profileUser.profile.name.first + " " + profileUser.profile.name.last,
                createdForUsername: profileUser.profile.login.username,
                createdForThumbnail: profileUser.profile.picture.thumbnail,
                likes: [],
                createdAt: new Date(),
                comments: []
            });
            $('textarea[name="new-post"]').val("");
        }

    }

})

/**
	* @isMethod true
	* @memberOf Method
	* @function helpers
	* @summary Es el metodo que comprueba la información del usuario y otorga información según unas reglas.
	* @locus profileFeed
	*/
Template.profileFeed.helpers({
	/**
	* @isMethod true
	* @memberOf Method
	* @function statusPlaceholder
	* @summary Es el metodo que detecta si el usuario esta en su propio perfil y de ese modo escribe en su propio muero, o esta en el perfil de otra persona y quiere escribirle algo.
	* @locus profileFeed
	* @param {Object} [profileUser] nombre del usuario, con firstname y lastname.
	*/
    statusPlaceholder:function(){
        var profileUser = Meteor.users.findOne({username:Router.current().params.username});
        if(profileUser && profileUser._id === Meteor.userId()){
            return "Update your status";
        } else {
            return "Post to their wall!";
        }
    },
	/**
	* @isMethod true
	* @memberOf Method
	* @function stories
	* @summary Es el metodo que recoge las historias escritas en el perfil de cierto usuario.
	* @locus profileFeed
	* @param {Object} [profileUser] nombre del usuario, con firstname y lastname.
	*/
    stories:function(){
        var profileUser = Meteor.users.findOne({username:Router.current().params.username}, {fields: {_id:1}});
        return profileUser ? Stories.find({createdFor: profileUser._id}, {sort: {createdAt:-1}, limit: 10}) : [];
    }

})