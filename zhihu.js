#!name=知乎去广告强化版
#!desc=基于日志分析更新，覆盖最新广告接口

# ------------ IP/域名直接拦截 ------------
^https?:\/\/(118\.89\.204\.198|103\.41\.167\.237|2402:4e00:1200:ed00:0:9089:6dac:96b6) url reject

# ------------ 广告追踪拦截 ------------
# Sugar广告主接口
^https?:\/\/sugar\.zhihu\.com\/plutus_adreaper url reject-dict
^https?:\/\/sugar\.zhihu\.com\/adx\/ url reject-dict

# Web分析接口
^https?:\/\/zhihu-web-analytics\.zhihu\.com\/api\/v\d+\/za\/logs\/batch url reject-dict

# APM性能监控
^https?:\/\/apm\.zhihu\.com\/collector\/apm url reject-dict

# DataHub数据收集
^https?:\/\/datahub\.zhihu\.com\/collector\/zlab url reject-dict

# ------------ 动态内容广告拦截 ------------
# 启动页广告
^https?:\/\/api\.zhihu\.com\/commercial_api\/(launch_v2|real_time_launch_v2)\? url reject-dict

# 信息流广告
^https?:\/\/api\.zhihu\.com\/topstory\/(recommend|hot-lists?) url script-response-body https://raw.githubusercontent.com/nova6086/new/refs/heads/main/yingyong.js

# 回答页广告
^https?:\/\/api\.zhihu\.com\/answers\/\d+\/recommendations url reject-dict

# 横幅广告
^https?:\/\/api\.zhihu\.com\/commercial_api\/banners_v3\/app_topstory_banner url reject-dict

# 用户页推广
^https?:\/\/api\.zhihu\.com\/people\/\d+\/activities url script-response-body https://raw.githubusercontent.com/nova6086/new/refs/heads/main/yingyong.js

# 评论推广
^https?:\/\/api\.zhihu\.com\/comment_v5\/.*\/comments url script-response-body https://raw.githubusercontent.com/nova6086/new/refs/heads/main/yingyong.js

# 搜索推广
^https?:\/\/api\.zhihu\.com\/search\/preset_words\? url script-response-body https://raw.githubusercontent.com/nova6086/new/refs/heads/main/yingyong.js

# ------------ 配置更新 ------------
# 动态配置拦截
^https?:\/\/m-cloud\.zhihu\.com\/api\/cloud\/config\/all\? url script-response-body https://raw.githubusercontent.com/nova6086/new/refs/heads/main/yingyong.js
^https?:\/\/appcloud2\.zhihu\.com\/v\d+\/config url reject-dict

# ------------ 其他优化 ------------
# 屏蔽用户引导
^https?:\/\/api\.zhihu\.com\/moments\/(tab_v2|recent) url reject-dict

# 屏蔽小红点
^https?:\/\/api\.zhihu\.com\/notifications\/v\d\/count url reject-dict

# 屏蔽直播推广
^https?:\/\/api\.zhihu\.com\/live\/v\d\/recommendation\/list url reject-dict

# ------------ Hostname ------------
hostname = www.zhihu.com, api.zhihu.com, zhuanlan.zhihu.com, sugar.zhihu.com, zhihu-web-analytics.zhihu.com, apm.zhihu.com, datahub.zhihu.com, appcloud2.zhihu.com, m-cloud.zhihu.com
