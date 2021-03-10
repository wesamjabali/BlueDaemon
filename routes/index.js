// required modules
const express = require("express");
const router = express.Router();
// const knex = require("../../database/knex");

// // user login
// router.post("/login", async (req, res, next) => {
//   try {
//     // initialize body params
//     const attemptUser = ({ email, password } = req.body);
//     // fetch user details
//     const [targetUser] = await knex("d3l_user")
//       .where({
//         email: attemptUser.email,
//       })
//       .select();

//     // 404 condition
//     if (typeof targetUser == "undefined") {
//       res.status(404).json({});
//       throw new Error("Localized - 404");
//     }
//     // match passwords then proceed
//     const passwordMatching = bcrypt.compareSync(
//       attemptUser.password,
//       targetUser.password
//     );

//     if (!passwordMatching) {
//       res.status(422).json({});
//       throw new Error("Validation Error - 422");
//     }
//     // create token for user

//     // Get roles that belong to user
//     const roles_object = await knex("d3l_user_role")
//       .where({
//         user_id: targetUser.id,
//       })
//       .select("role");

//     var roles_array = [];
//     roles_object.forEach((r) => {
//       roles_array.push(r.role);
//     });

//     const token = jwt.sign(
//       {
//         id: targetUser.id,
//         email: targetUser.email,
//         roles: roles_array,
//         first_name: targetUser.first_name,
//         last_name: targetUser.last_name,
//         iat: Math.floor(Date.now() / 1000),
//       },
//       process.env.AUTH_CLIENT_SECRET,
//       {
//         expiresIn: "10h",
//       }
//     );
//     // response logic
//     res.status(201).json({
//       token,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post("/register", async (req, res, next) => {
//   try {
//     const newUser = ({
//       first_name,
//       last_name,
//       email,
//       password,
//       phone,
//       address,
//     } = req.body);

//     let bcryptPass = bcrypt.hashSync(newUser.password, salt);

//     let [existingUser] = await knex("d3l_user")
//       .where({
//         email: newUser.email,
//       })
//       .select();

//     if (typeof existingUser != "undefined") {
//       res.status(404).json({});
//       throw new Error("Localized - 404");
//     }

//     await knex("d3l_user").insert({
//       first_name: newUser.first_name,
//       last_name: newUser.last_name,
//       email: newUser.email,
//       password: bcryptPass,
//       phone: newUser.phone,
//       address: newUser.address,
//     });

//     res.status(201).json({});
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = router;
