import Review from  "../models/review.js"

export function addReview (req,res){
    if(req.user == null){
        res.status(401).json({
            message : "Please login and try again"
        })
        return;
    }

    const data = req.body;

    data.name = req.user.firstName + " " + req.user.lastName;
    data.profilePictuer = req.user.profilePictuer;
    data.email = req.user.email;


    const newReview = new Review(data)

    newReview.save().then (() =>{
        res.json({ meessage : "Review added successfully"});
    }).catch(()=>{
        res.status(500).jason({"error": "Review addition failed"});
    })
}

export function getReviews(req,res){

    const user = req.user;

    if(user == null || user.role != "admin"){
        Review.find({isApproved : true}).then((reviews)=>{
            res.json(reviews);
        })
        return
    }

    if(user.role == "admin"){
        Review.find().then((reviews)=>{
            res.json(reviews);
          })
    }
}

export function deleteReviews
(req,res){
    const email = req.params.email;

    if(req.user == null){
        res.status(401).json({message:"Please login and try again"});
        return 
    }

    if(req.user.role == admin ){
        Review.deleteOne({email:email}).then(()=>{
            req.json({message:"Review deleted successfully"});
        }).catch(()=>{
            res.status(500).json({error :"Review deletion failed"})
        });

        return
    }

    if(req.user.role == "customer"){
        if(req.user.email){
            Review.deleteOne({email:email}).then(()=>{
                res.json({message:"Review deleted successfully"});
            }).catch(()=>{
                res.status(500).json({error :"Review deletion failed"});
            });
        }
    }else{
        res.status(403).json({message:"You are not authorized to perform this action"});
    }
    
}


export function approveReview(req,res){
    const email = req.params.email;

    if(req.user == null){
        res.status(401).json({message:"Please login and try again"});
        return
    }

    if(req.user.role == "admin"){
        Review.updateOne(
            {
                email : email,
            },
            {
                isApproved:true,
            }
        ).then(()=>{
            res.json({message: "Review approved successfuly"});
        }).catch(()=>{
            res.status(500).json({error : "Review approval failed"});
            
        });


    }else{
        res.status(403).json({message: "You are not an admin.only admin can approve the reviews."})
    }
}   