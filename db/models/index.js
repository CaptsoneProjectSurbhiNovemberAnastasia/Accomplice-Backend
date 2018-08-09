const User = require('./user')
const Trait = require('./trait')
const UserTrait = require('./usertrait')
const Tag = require('./tag')
const Activity = require('./activity')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 ś
 *    BlogPost.belongsTo(User)
 */

Trait.belongsToMany(User, { through: UserTrait })
User.belongsToMany(Trait, { through: UserTrait })

Activity.belongsToMany(Tag, { through: 'ActivityTag' })
Tag.belongsToMany(Activity, { through: 'ActivityTag' })

User.belongsTo(Activity)
Activity.hasMany(User)

User.belongsToMany(User, { through: 'Match' })

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Trait,
  UserTrait,
  Tag,
  Activity,
}
