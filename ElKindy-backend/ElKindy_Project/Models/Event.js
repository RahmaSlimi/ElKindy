// const mongoose = require("mongoose");

// const eventSchema = mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: true
//         },
//         description: {
//             type: String,
//             required: true
//         },
//         imageUrl: {
//              type: String 
//         },
//         startDate: {
//             type: Date,
//             required: true
            
//         },
//         endDate: {
//             type: Date,
//             //required: true
            
//         },
//         location: {
//             type: String,
//             required: true
            
//         },
//         price: {
//           type: Number,
//           required: true
//         },
//         room_name: { 
//             type: String,
//             required: true
//         },
//         room_shape: { 
//             type: String,
//             // enum: ['Rectangular', 'Triangular', 'Circle','Square'],
//             // default: 'midterm exam'
//             required: true
//         },
//         room_capacity: {
//              type: Number,
//              required: true 
//         },
//         room_distributionSeats: [{ type: String }] // You can adjust the type according to the seat distribution structure
//         ,
//         tickets: [{
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Ticket'
//         }],
//         comments: [{
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Comment'
//         }]
//     }

    
// )

// const Event = mongoose.model('Event', eventSchema);
// module.exports = Event;

const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        //required: true
    },
    duration:{
        type:Number,
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    room_name: {
        type: String,
        required: true
    },
    room_shape: {
        type: String,
        // required: true
    },
    room_capacity: {
        type: Number,
        
    },
    room_distributionSeats: [{ type: String }],
    
    series: {
        type: [String],
        // required: true
    },
    seat: {
        type: Number,
        // required: true
    },
    selectedSeats: {
        type: [String], // Adjust the type according to the seat distribution structure
        default: []
    },
    
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
    
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
