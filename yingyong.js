const $ = new API("zhihu-ultimate");
const blockedUsers = ["故事档案局", "盐选推荐", "每日经济新闻", "第一财经"];

// 1. 处理外链跳转（直连）
if ($.request.url.includes("link.zhihu.com/?target=http")) {
    const targetUrl = decodeURIComponent($.request.url.split("target=")[1]);
    $.done({ response: { status: 302, headers: { Location: targetUrl } } });
    return;
}

// 2. 自动跳转热榜
if ($.request.url === "https://www.zhihu.com/" || $.request.url === "https://www.zhihu.com") {
    $.done({ response: { status: 302, headers: { Location: "https://www.zhihu.com/hot" } } });
    return;
}

// 3. 处理网页端广告 & API 数据
if ($.response.status === 200) {
    let body = $.response.body;
    const url = $.request.url;

    // (A) 屏蔽营销号用户名（网页 + API）
    blockedUsers.forEach(user => {
        body = body.replace(
            new RegExp(`"authorName":\\s*"${user}"`, "g"),
            `"authorName":"【已屏蔽】${user}"`
        );
    });

    // (B) 屏蔽付费内容（盐选推荐）
    body = body.replace(
        /<div class="(KfeCollection-AnswerTopCard-Container|PaidContent)">.*?<\/div>/gs,
        "<div>【已屏蔽】付费内容</div>"
    );

    // (C) 屏蔽广告卡片
    body = body.replace(
        /<div class="(AdSlot|PromotionCard|MarketingCard)">.*?<\/div>/gs,
        ""
    );

    // (D) 净化标题（去掉"知乎"后缀）
    if (url.includes("www.zhihu.com")) {
        body = body.replace(
            /<title>.*?<\/title>/,
            match => match.replace(/ - 知乎$/, "")
        );
    }

    // (E) 过滤 API 推荐流广告
    if (url.includes("api.zhihu.com")) {
        try {
            const data = JSON.parse(body);
            if (data.data && Array.isArray(data.data)) {
                data.data = data.data.filter(item => 
                    !blockedUsers.includes(item.author?.name) && 
                    !item.ad_info
                );
                body = JSON.stringify(data);
            }
        } catch (e) {}
    }

    $.done({ body });
} else {
    $.done();
}
