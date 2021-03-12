const config = require("../config.json");
module.exports = {
  name: "",
  description: "",
  execute(member) {
    member.send(
      `
> **Welcome to CDM Discussions!**
> __The central hub for all CDM classes and discussions__
> _I'm **BlueDaemon**, your course-management assistant!_

**Use the commands below to join your courses!**
\`\`\`
.help                    > See all courses/commands
.join classname          > Join a course
.join classname password > Join a protected course
.role join leetcoder     > Get notified of daily leetcoding sessions
\`\`\`
\`Having trouble? DM @wesam\`

Have a great quarter!
`
    );
  },
};
