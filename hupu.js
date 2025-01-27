const init = "/init";
const topics = "topics";
const hot = "/hotRank";
const liveTabList = "/matchallapi/liveTabList";
const recommend = "/recommend/getFeed"; // 新增推荐接口标识

let url = $request.url;
let body = $response.body;
let obj = JSON.parse(body);

// 处理首页菜单
if (url.includes(init)) {
  obj.result.clientLevelOneNavV2 = obj.result.clientLevelOneNavV2.filter(
    item => item.en === "hotRank" || item.en === "match"
  );
  delete obj.result.activityNav;
}

// 处理专区横幅
if (url.includes(topics)) {
  obj.data.topicResources = [];
}

// 过滤热榜游戏帖子
if (url.includes(hot)) {
  const nicknamesToExclude = ["虎扑电竞资讯"];
  const topicNamesToExclude = ["英雄联盟", "王者荣耀", "和平精英"];
  obj.result.listV2 = obj.result.listV2.filter(item => 
    !nicknamesToExclude.includes(item.thread.nickname) &&
    !topicNamesToExclude.includes(item.thread.topic_name)
  );
}

// 处理赛事直播标签页
if (url.includes(liveTabList)) {
  const tabList = ["live_lottery", "live_game"];
  obj.result.categoryList = obj.result.categoryList.filter(
    item => !tabList.includes(item.categoryId)
  );
}

// 新增推荐信息流处理逻辑
if (url.includes(recommend)) {
  // 策略1: 过滤广告（假设广告项有 type=ad）
  obj.data.list = obj.data.list.filter(item => item.type !== "ad");

  // 策略2: 按互动数过滤（保留点赞>500的帖子）
  obj.data.list = obj.data.list.filter(item => item.upvote > 500);

  // 策略3: 屏蔽指定用户（可选）
  const blockedUsers = ["推广小助手", "游戏官方"];
  obj.data.list = obj.data.list.filter(item => 
    !blockedUsers.includes(item.author.name)
  );
}

// 返回修改后的响应
body = JSON.stringify(obj);
$done({body});
