import Table, { Cell } from "cli-table3";
import { Config } from "../../types/config";
export default function tableLog(data: Config[]) {
  const table = new Table({
    chars: {
      top: "═",
      "top-mid": "╤",
      "top-left": "╔",
      "top-right": "╗",
      bottom: "═",
      "bottom-mid": "╧",
      "bottom-left": "╚",
      "bottom-right": "╝",
      left: "║",
      "left-mid": "╟",
      mid: "─",
      "mid-mid": "┼",
      right: "║",
      "right-mid": "╢",
      middle: "│",
    },
    style: {
      "padding-left": 0,
      "padding-right": 0,
    },
    colWidths: [15, 15, 15, 15, 15, 15, 15, 15, 15],
    wordWrap: true,
  });
  table.push(
    [
      { content: "项目信息", colSpan: 2, hAlign: "center" },
      { content: "服务器信息", colSpan: 5, hAlign: "center" },
      { content: "项目详细信息", colSpan: 3, hAlign: "center" },
    ],
    [
      { content: "项目名称", hAlign: "center" },
      { content: "value", hAlign: "center" },
      { content: "服务器地址", hAlign: "center" },
      { content: "服务器端口", hAlign: "center" },
      { content: "服务器用户名", hAlign: "center" },
      { content: "服务器密码", hAlign: "center" },
      { content: "服务器类型", hAlign: "center" },
      { content: "远程目录", hAlign: "center" },
      { content: "项目目录", hAlign: "center" },
      { content: "打包命令", hAlign: "center" },
    ]
  );

  // 添加数据行
  table.push(
    ...data.map(
      (item) =>
        [
          { content: item.name, hAlign: "center" },
          { content: item.value, hAlign: "center" },
          { content: item.server.host, hAlign: "center" },
          { content: item.server.port, hAlign: "center" },
          { content: item.server.username, hAlign: "center" },
          { content: "********", hAlign: "center" },
          { content: item.serverType, hAlign: "center" },
          { content: item.deployDir, hAlign: "center" },
          { content: item.targetDir, hAlign: "center" },
          { content: item.build, hAlign: "center" },
        ] as Cell[]
    )
  );
  console.log(table.toString());
}
