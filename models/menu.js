var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        index: true,
        validate: {
            validator: function (value) {
                let forFood = ["pizza", "pasta", "noodle", "burger"];
                let forDrink = ["juice", "coffee", "tea", "mineral"];
                let getType = this.isNew ? this.get('type') : this._update.$set.type;

                if (getType == 'food' && forFood.includes(value)) {
                    return true;
                }

                if (getType == 'drink' && forDrink.includes(value)) {
                    return true;
                }

                return false;
            },
            message: props => `${props.path} is not valid`,
            context: 'body'
        }
    },
    type: {
        type: String,
        required: true,
        index: true,
        enum: ['food', 'drink']
    },
    created_at: {
        type: Date, 
        default: Date.now
    },
    updated_at: {
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('Menu', menuSchema);