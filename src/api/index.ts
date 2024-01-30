import http from "node:http";
import readConfig from "../common/readConfig";
import runFTP from "../option/runFTP";
import runSSH from "../option/runSSH";
export default async function (
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let query: { name?: string; value?: string } = {};
  req.url
    ?.split("?")[1]
    ?.split("&")
    .map((item) => {
      const key = item.split("=")[0];
      const value = item.split("=")[1];
      return {
        [key]: value,
      };
    })
    .forEach((item) => {
      query = { ...query, ...item };
    });
  switch (req.url?.split("?")[0]) {
    case "/api/config":
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(readConfig()));
      break;
    case "/api/run":
      res.writeHead(200, { "Content-Type": "application/json" });
      const config = readConfig().find((item) => item.name === query.name);
      if (config) {
        if (config.serverType === "ftp") {
          try {
            const result = await runFTP(config);
            res.end(
              JSON.stringify({
                code: 200,
                message: "运行成功",
              })
            );
          } catch (error) {
            res.writeHead(200, {
              "Content-Type": "application/json",
            });
            res.end(JSON.stringify({ code: 500, message: error }));
          }
        }else{
            try {
                const result = await runSSH(config);
                res.end(JSON.stringify(
                    {
                        code:200,
                        message:"运行成功"
                    }
                ))
            }catch (error) {
                res.end(
                    JSON.stringify({
                        code: 500,
                        message: error
                    })
                )
            }
        }
      }
      break;
  }
}
