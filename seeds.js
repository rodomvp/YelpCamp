var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")

var data = [{
    name: "Shady Sands",
    image: "http://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5253636.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi vel esse modi earum amet, soluta atque nesciunt, ipsa labore itaque distinctio ipsam iure quia, accusantium nobis maiores dicta excepturi consequuntur?"
}, {
    name: "Timber Trees",
    image: "http://haulihuvila.com/wp-content/uploads/2012/09/hauli-huvila-campgrounds-lg.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias molestiae impedit illo sapiente, facilis dignissimos sint! Delectus dolore, amet est possimus fugit ab, quibusdam voluptates quasi eligendi placeat, nemo architecto!"
}, {
    name: "Prickly Pines",
    image: "http://www.makeyourdayhere.com/ImageRepository/Document?documentID=51",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur laboriosam, ab magni excepturi vel labore obcaecati temporibus architecto, voluptate voluptates culpa dolor. Amet, fugit inventore velit? Similique perferendis non blanditiis."
}];

function seedDB() {
    Campground.remove({}, function(e) {
        if (e) {
            console.log(e);
        }
        console.log("Campgrounds emptied!")
    });

    data.forEach(function(seed) {
        Campground.create(seed, function(e, campground) {
            if (e) {
                console.log(e);
            } else {
                console.log("added a campground: " + seed.name);
                //create a comment
                Comment.create({
                        text: "This place is great!",
                        author: "Homer"
                    },
                    function(e, comment){
                    	if(e){
                    		console.log(e);
                    	} else{
                    	campground.comments.push(comment);
                    	campground.save();
                    	console.log("Created new comment: " + comment.text)
                    }});
            }
        })
    })
}

module.exports = seedDB;