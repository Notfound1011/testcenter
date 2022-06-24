export function tipsStatus (type, routePath) {
  const key = routePath + '#tips'
  if (type === 'init') {
    return !window.localStorage.getItem(key)
  }
  if (type === 'save') {
    window.localStorage.setItem(key, 'false')
  }
}

// 先使用本地化数据
export function btn_data () {
  return {
    "envBtn":
      [
        {
          "btnDesc": "Fat1",
          "btnInfo":
            [
              {
                "btnText": "PhemexGlobal",
                "btnLink": "https://fat.phemex.com/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "PhemexTurkey",
                "btnLink": "https://fat.phemex.com.tr/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter",
                "btnLink": "https://fat.5810a957f4121923619d86408a6e07d2.me/#/home",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter(TR)",
                "btnLink": "https://fat-tr.5810a957f4121923619d86408a6e07d2.me:10082/#/login",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "NewLangdingPage",
                "btnLink": "https://fat.phemex.com/lp-crypto-platform-v2",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "TradingCompetition",
                "btnLink": "https://fat.phemex.com/de/crypto-trading-competition#playerRegister",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Eureka",
                "btnLink": "http://alb-sap-nacos-424928052.ap-southeast-1.elb.amazonaws.com:81/",
                "btnStatus": 1,
                "btnTips": ""
              }
            ]
        },
        {
          "btnDesc": "Fat2",
          "btnInfo":
            [
              {
                "btnText": "PhemexGlobal",
                "btnLink": "https://fat2.phemex.com/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "PhemexTurkey",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter",
                "btnLink": "https://fat.5810a957f4121923619d86408a6e07d2.me:444/#/home",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter(TR)",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              },
              {
                "btnText": "NewLangdingPage",
                "btnLink": "https://fat2.phemex.com/lp-crypto-platform-v2",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "TradingCompetition",
                "btnLink": "https://fat2.phemex.com/de/crypto-trading-competition#playerRegister",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Eureka",
                "btnLink": "http://alb-sap-nacos-424928052.ap-southeast-1.elb.amazonaws.com:84/",
                "btnStatus": 1,
                "btnTips": ""
              }
            ]
        },
        {
          "btnDesc": "Fat3",
          "btnInfo":
            [
              {
                "btnText": "PhemexGlobal",
                "btnLink": "https://fat3.phemex.com/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "PhemexTurkey",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter",
                "btnLink": "https://fat.5810a957f4121923619d86408a6e07d2.me:446/#/home",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter(TR)",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              },
              {
                "btnText": "NewLangdingPage",
                "btnLink": "https://fat3.phemex.com/lp-crypto-platform-v2",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "TradingCompetition",
                "btnLink": "https://fat3.phemex.com/de/crypto-trading-competition#playerRegister",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Eureka",
                "btnLink": "http://alb-sap-nacos-424928052.ap-southeast-1.elb.amazonaws.com:85/",
                "btnStatus": 1,
                "btnTips": ""
              }
            ]
        },
        {
          "btnDesc": "Fat4",
          "btnInfo":
            [
              {
                "btnText": "PhemexGlobal",
                "btnLink": "https://fat4.phemex.com/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "PhemexTurkey",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter",
                "btnLink": "https://fat.5810a957f4121923619d86408a6e07d2.me:447",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter(TR)",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              },
              {
                "btnText": "NewLangdingPage",
                "btnLink": "https://fat4.phemex.com/lp-crypto-platform-v2",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "TradingCompetition",
                "btnLink": "https://fat4.phemex.com/de/crypto-trading-competition#playerRegister",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Eureka",
                "btnLink": "http://alb-sap-nacos-424928052.ap-southeast-1.elb.amazonaws.com:86",
                "btnStatus": 1,
                "btnTips": ""
              }
            ]
        },
        {
          "btnDesc": "Fat5",
          "btnInfo":
            [
              {
                "btnText": "PhemexGlobal",
                "btnLink": "https://fat5.phemex.com/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "PhemexTurkey",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter",
                "btnLink": "https://fat.5810a957f4121923619d86408a6e07d2.me:448",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter(TR)",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              },
              {
                "btnText": "NewLangdingPage",
                "btnLink": "https://fat5.phemex.com/lp-crypto-platform-v2",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "TradingCompetition",
                "btnLink": "https://fat5.phemex.com/de/crypto-trading-competition#playerRegister",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Eureka",
                "btnLink": "http://alb-sap-nacos-424928052.ap-southeast-1.elb.amazonaws.com:87",
                "btnStatus": 1,
                "btnTips": ""
              }
            ]
        },
        {
          "btnDesc": "Testnet",
          "btnInfo":
            [
              {
                "btnText": "PhemexGlobal",
                "btnLink": "https://testnet.phemex.com/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "PhemexTurkey",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter",
                "btnLink": "https://fat.5810a957f4121923619d86408a6e07d2.me:446/#/home",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter(TR)",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              },
              {
                "btnText": "NewLangdingPage",
                "btnLink": "https://testnet.phemex.com/lp-crypto-platform-v2",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "TradingCompetition",
                "btnLink": "https://testnet.phemex.com/de/crypto-trading-competition#playerRegister",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Eureka",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              }
            ]
        },
        {
          "btnDesc": "EA",
          "btnInfo":
            [
              {
                "btnText": "PhemexGlobal",
                "btnLink": "https://ea.phemex.com/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "PhemexTurkey",
                "btnLink": "https://ea.phemex.com.tr/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter",
                "btnLink": "",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter(TR)",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              },
              {
                "btnText": "NewLangdingPage",
                "btnLink": "https://ea.phemex.com/lp-crypto-platform-v2",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "TradingCompetition",
                "btnLink": "https://ea.phemex.com/de/crypto-trading-competition#playerRegister",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Eureka",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              }
            ]
        },
        {
          "btnDesc": "PROD",
          "btnInfo":
            [
              {
                "btnText": "PhemexGlobal",
                "btnLink": "https://www.phemex.com/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "PhemexTurkey",
                "btnLink": "https://www.phemex.com.tr/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter",
                "btnLink": "https://a.5810a957f4121923619d86408a6e07d2.me:444/#/login",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "MangementCenter(TR)",
                "btnLink": "https://a.5810a957f4121923619d86408a6e07d2.me:10082/#/login",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "NewLangdingPage",
                "btnLink": "https://www.phemex.com/lp-crypto-platform-v2",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "TradingCompetition",
                "btnLink": "https://www.phemex.com/de/crypto-trading-competition#playerRegister",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Eureka",
                "btnLink": "",
                "btnStatus": 0,
                "btnTips": ""
              }
            ]
        }
      ],
    "lowPriorityBtn":
      [
        {
          "btnDesc": "How to?",
          "btnInfo":
            [
              {
                "btnText": "DevOps HowTo",
                "btnLink": "http://confluence.cmexpro.com/display/DEVOPS/HowTo",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "如何申请云资源",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=48595674",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "如何申请SSH访问权限",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=36673398",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Project from 0to1",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=38669500",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "OPS提需",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=28889678",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "操作手册",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=4228810",
                "btnStatus": 1,
                "btnTips": ""
              }
            ]
        },
        {
          "btnDesc": "Infomation Guide",
          "btnInfo":
            [
              {
                "btnText": "Release Notes",
                "btnLink": "http://confluence.cmexpro.com/display/QA/Release+Notes",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "线上变更计划",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=40568099",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "领域职责划分",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=36672286",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "nacos使用规范",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=36675144",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "OPS职责划分",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=40571229",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "job类更新最新的checkpoint",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=48612100",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Jira使用规范",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=38670997",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "紧急发布流程规范",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=28894496",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "提测规范",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=4227403",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "开发提测流程",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=28871922",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "资料共享Books",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=47515353",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "功能架构",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=19434824",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "紧急发版流程",
                "btnLink": "http://confluence.cmexpro.com/pages/viewpage.action?pageId=28894496",
                "btnStatus": 1,
                "btnTips": ""
              }
            ]
        },
        {
          "btnDesc": "Inner Platform",
          "btnInfo":
            [
              {
                "btnText": "Jira",
                "btnLink": "http://jira.cmexpro.com/secure/Dashboard.jspa",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "confluence",
                "btnLink": "http://confluence.cmexpro.com/#recently-viewed",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Jenkins",
                "btnLink": "http://jenkins.cmex.corp/login?from=%2F",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "OPSYS",
                "btnLink": "http://opsys.cmex.corp/#/cd/qa",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "JumpServer",
                "btnLink": "https://jump.cmex.corp/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "bitbucket",
                "btnLink": "http://bitbucket.cmexpro.com/projects/DEVOPS/repos/newconfig/browse",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Sonar",
                "btnLink": "http://18.141.2.143:9000/dashboard?id=MPR_UI-phemex-admin",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "CloudQuery",
                "btnLink": "http://cloudquery.cmex.corp/query",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "kibana",
                "btnLink": "https://prod-kibana01.5810a957f4121923619d86408a6e07d2.me/_plugin/kibana/app/discover#",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "grafana",
                "btnLink": "https://grafana03.5810a957f4121923619d86408a6e07d2.me/d/3Hgl2NQ7k/user-service?orgId=1&refresh=5s&from=now-5m&to=now",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Yapi",
                "btnLink": "http://yapi.cmexpro.com/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "FAT XXL",
                "btnLink": "http://alb-sap-nacos-424928052.ap-southeast-1.elb.amazonaws.com:83/xxl-job-admin/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "FAT Nacos",
                "btnLink": "http://alb-sap-nacos-424928052.ap-southeast-1.elb.amazonaws.com/nacos/#/configurationManagement?dataId=&group=&appName=&namespace=&pageSize=&pageNo=",
                "btnStatus": 1,
                "btnTips": ""
              }
            ]
        },
        {
          "btnDesc": "External Platform",
          "btnInfo":
            [
              {
                "btnText": "蓝湖设计稿",
                "btnLink": "https://lanhuapp.com/web/#/item?tid=f6bd3f28-c824-41b4-9a7e-b85a14973037&teamId=f6bd3f28-c824-41b4-9a7e-b85a14973037",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "神策",
                "btnLink": "https://analysis.phemex.cloud/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "APPFlye",
                "btnLink": "https://hq1.appsflyer.com/auth/login",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "GooglePlay",
                "btnLink": "https://play.google.com/console/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "AppStoreConnect",
                "btnLink": "https://appstoreconnect.apple.com/apps/1499601684/appstore/ios/version/inflight",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "HuaweiStore",
                "btnLink": "https://developer.huawei.com/consumer/en/service/josp/agc/index.html#/myApp/106192077/9322385623857555199",
                "btnStatus": 1,
                "btnTips": ""
              }
            ]
        },
        {
          "btnDesc": "Others",
          "btnInfo":
            [
              {
                "btnText": "yopmail",
                "btnLink": "https://yopmail.com/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Gmail",
                "btnLink": "https://mail.google.com/mail/u/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Testnet Faucet",
                "btnLink": "https://bitcoinfaucet.uo1.net/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "时间戳转换",
                "btnLink": "https://tool.chinaz.com/tools/unixtime.aspx",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "CRON表达式",
                "btnLink": "https://qqe2.com/cron",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "JSON格式化",
                "btnLink": "https://1024tools.com/json",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "正则表达式",
                "btnLink": "https://c.runoob.com/front-end/854/",
                "btnStatus": 1,
                "btnTips": ""
              },
              {
                "btnText": "Unicode编码",
                "btnLink": "https://tool.chinaz.com/tools/unicode.aspx",
                "btnStatus": 1,
                "btnTips": ""
              }
            ]
        }
      ]
  }
}
