import path from "path";

const home = (req, res) =>
  res.sendFile(path.resolve("server", "src", "view.html"));

export default home;
