const os = require("node:os");
const { syncBuiltinESMExports } = require("node:module");

try {
  os.userInfo();
} catch {
  os.userInfo = () => ({
    username: process.env.USERNAME || "skillbridge",
    uid: -1,
    gid: -1,
    shell: null,
    homedir: process.env.USERPROFILE || os.tmpdir(),
  });
  syncBuiltinESMExports();
}
