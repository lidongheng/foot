import scrapy
import random
import collections
import time


class Zqwin007Spider(scrapy.Spider):
    name = 'zqwin007'
    '''爬虫名字'''
    allowed_domains = ['zq.win007.com']
    '''允许的域名'''
    custom_settings = {
        "DEFAULT_REQUEST_HEADERS": {
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Host': 'zq.win007.com',
            'Referer': 'http://zq.win007.com/cn/League/2020-2021/36.html',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36'
        }
    }
    # 英超 36 西甲 31 意甲 34 德甲 8 法甲 11  荷甲 16
    # start_urls = ['http://zq.win007.com/jsData/letGoal/2020-2021/l36.js?flesh='+str(random.random()),
    #               'http://zq.win007.com/jsData/letGoal/2020-2021/l34.js?flesh='+str(random.random()),
    #               'http://zq.win007.com/jsData/letGoal/2020-2021/l31.js?flesh='+str(random.random()),
    #               'http://zq.win007.com/jsData/letGoal/2020-2021/l8.js?flesh='+str(random.random()),
    #               'http://zq.win007.com/jsData/letGoal/2020-2021/l11.js?flesh='+str(random.random()),
    #               'http://zq.win007.com/jsData/letGoal/2020-2021/l273.js?flesh'+str(random.random()),
    #               'http://zq.win007.com/jsData/bigSmall/2020-2021/bs36.js?flesh'+str(random.random()),
    #               'http://zq.win007.com/jsData/bigSmall/2020-2021/bs34.js?flesh'+str(random.random()),
    #               'http://zq.win007.com/jsData/bigSmall/2020-2021/bs31.js?flesh='+str(random.random()),
    #               'http://zq.win007.com/jsData/bigSmall/2020-2021/bs8.js?flesh='+str(random.random()),
    #               'http://zq.win007.com/jsData/bigSmall/2020-2021/bs11.js?flesh='+str(random.random()),
    #               'http://zq.win007.com/jsData/bigSmall/2020-2021/bs273.js?flesh='+str(random.random()),
    #               'http://zq.win007.com/jsData/timeDistri/2020-2021/td36.js?flesh='+str(random.random()),
    #               'http://zq.win007.com/jsData/timeDistri/2020-2021/td34.js?flesh=' + str(random.random()),
    #               'http://zq.win007.com/jsData/timeDistri/2020-2021/td31.js?flesh=' + str(random.random()),
    #               'http://zq.win007.com/jsData/timeDistri/2020-2021/td8.js?flesh=' + str(random.random()),
    #               'http://zq.win007.com/jsData/timeDistri/2020-2021/td11.js?flesh=' + str(random.random()),
    #               'http://zq.win007.com/jsData/timeDistri/2020-2021/td273.js?flesh=' + str(random.random())
    #               ]
    # start_urls = [
    #     'http://zq.win007.com/jsData/timeDistri/2020-2021/td36.js?flesh=' + str(random.random()),
    #     'http://zq.win007.com/jsData/timeDistri/2020-2021/td34.js?flesh=' + str(random.random()),
    #     'http://zq.win007.com/jsData/timeDistri/2020-2021/td31.js?flesh=' + str(random.random()),
    #     'http://zq.win007.com/jsData/timeDistri/2020-2021/td8.js?flesh=' + str(random.random()),
    #     'http://zq.win007.com/jsData/timeDistri/2020-2021/td11.js?flesh=' + str(random.random()),
    #     'http://zq.win007.com/jsData/timeDistri/2020-2021/td273.js?flesh=' + str(random.random())
    # ]
    # start_urls = [
    #     'http://zq.win007.com/jsData/matchResult/2020-2021/s36.js?version=' + time.strftime("%Y%m%d%H", time.localtime()),
    #     'http://zq.win007.com/jsData/matchResult/2020-2021/s34.js?version=' + time.strftime("%Y%m%d%H", time.localtime()),
    #     'http://zq.win007.com/jsData/matchResult/2020-2021/s31.js?version=' + time.strftime("%Y%m%d%H", time.localtime()),
    #     'http://zq.win007.com/jsData/matchResult/2020-2021/s8.js?version=' + time.strftime("%Y%m%d%H", time.localtime()),
    #     'http://zq.win007.com/jsData/matchResult/2020-2021/s11.js?version=' + time.strftime("%Y%m%d%H", time.localtime())
    # ]

    start_urls = [
        'http://zq.win007.com/jsData/matchResult/2021-2022/s8.js?version=' + time.strftime("%Y%m%d%H",
                                                                                            time.localtime()),
        'http://zq.win007.com/jsData/letGoal/2021-2022/l8.js?flesh='+str(random.random()),
        'http://zq.win007.com/jsData/bigSmall/2021-2022/bs8.js?flesh'+str(random.random()),
        'http://zq.win007.com/jsData/timeDistri/2021-2022/td8.js?flesh=' + str(random.random())
    ]

    # start_urls = [
    #     'http://zq.win007.com/jsData/matchResult/2021/s1122.js?version=' + time.strftime("%Y%m%d%H",
    #                                                                                          time.localtime()),
    #     'http://zq.win007.com/jsData/letGoal/2021/l1122.js?flesh=' + str(random.random()),
    #     'http://zq.win007.com/jsData/bigSmall/2021/bs1122.js?flesh' + str(random.random()),
    #     'http://zq.win007.com/jsData/timeDistri/2021/td1122.js?flesh=' + str(random.random())
    # ]

    def parse(self, response):
        lists1 = response.text.split(';')
        originDataList = []
        leagueCode = ''
        leagueDict = {}
        for lista in lists1:
            temp1 = lista.split('=')
            temp2 = temp1[0].split(' ')
            if len(temp2) == 3:
                temp1[0] = temp2[-2]
            elif len(temp2) == 2:
                temp1[0] = temp2[-1]
            else:
                continue
            if '[' in temp1[1]:
                temp1[1] = temp1[1].replace('[', '{').replace(']', '}')
            else:
                temp1[1] = '{' + temp1[1] + '}'
            originDataList.append(temp1)
        for data in originDataList:
            if data[0].strip() == 'arrLeague':
                leagueCode = data[1].split()[0].replace("'", "").strip()
                print(data[1].split(',')[1].replace("'", "").strip() + ':')
            if data[0].strip() == 'arrTeam':
                list11 = data[1].strip()[2:-2].replace("'", "").split('},{')
                for list13 in list11:
                    leagueTeam = list13.split(',')
                    leagueDict[leagueTeam[0].strip()] = leagueTeam[1].strip()
            # 总盘路
            if data[0].strip() == 'TotalPanLu':
                """
                  总盘路，是个二维json，先去掉最左边和最右边的大括号，剩下多个json字符串，根据},{进行分割，把第一个的{和最后一个的}去掉
                """
                list3 = data[1].strip()[2:-2].replace("'", "").split('},{')
                yingpanTeamDataList = []
                for listc in list3:
                    listd = []
                    temp4 = listc.split(',')
                    for temp3 in temp4:
                        listd.append(temp3)
                    yingpanTeamDataList.append(listd)
                '''
                  liste是个二维数组，记录着赢盘榜排名，现在要找出赢盘率大于60的球队
                '''
                for teamData in yingpanTeamDataList:
                    if leagueCode == '271':
                        if float(teamData[-3]) > 70:
                            print("赢盘：%s %s" % (leagueDict[teamData[1]], teamData[-3] + '%'))
                        if float(teamData[-3]) < 30:
                            print("输盘：%s %s" % (leagueDict[teamData[1]], teamData[-3] + '%'))
                    else:
                        if float(teamData[-3]) > 60:
                            print("赢盘：%s %s" % (leagueDict[teamData[1]], teamData[-3] + '%'))
                        if float(teamData[-3]) < 40:
                            print("输盘：%s %s" % (leagueDict[teamData[1]], teamData[-3] + '%'))
            # 总大小
            if data[0].strip() == 'TotalBs':
                list3 = data[1].strip()[2:-2].replace("'", "").split('},{')
                daxiaoTeamDataList = []
                for listc in list3:
                    listd = []
                    temp4 = listc.split(',')
                    for temp3 in temp4:
                        listd.append(temp3)
                    daxiaoTeamDataList.append(listd)
                '''
                  liste是个二维数组，记录着赢盘榜排名，现在要找出赢盘率大于60的球队
                '''
                for teamData in daxiaoTeamDataList:
                    if leagueCode == '271':
                        if float(teamData[-3]) > 70:
                            print("大球：%s %s" % (leagueDict[teamData[1]], teamData[-3] + '%'))
                        if float(teamData[-3]) < 30:
                            print("小球：%s %s" % (leagueDict[teamData[1]], teamData[-3] + '%'))
                    else:
                        if float(teamData[-3]) > 60:
                            print("大球：%s %s" % (leagueDict[teamData[1]], teamData[-3] + '%'))
                        if float(teamData[-3]) < 40:
                            print("小球：%s %s" % (leagueDict[teamData[1]], teamData[-3] + '%'))
            # 终场绝杀
            if data[0].strip() == 'arrData':
                list3 = data[1].strip()[2:-2].replace("'", "").split('},{')
                jueshaTeamDataList = []
                for listc in list3:
                    listd = []
                    temp4 = listc.split(',')
                    for temp3 in temp4:
                        listd.append(temp3)
                    jueshaTeamDataList.append(listd)
                '''
                  liste是个二维数组，记录着赢盘榜排名，现在要找出赢盘率大于60的球队
                '''
                juesha_order_dict = collections.OrderedDict()
                juesha_dict = {}
                juesha_list = []
                for teamData in jueshaTeamDataList:
                    juesha_dict[teamData[0]] = int(teamData[-3]) + int(teamData[-2]) + int(teamData[-1])
                    juesha_order_dict[teamData[0]] = int(teamData[-3]) + int(teamData[-2]) + int(teamData[-1])
                    juesha_list.append(int(teamData[-3]) + int(teamData[-2]) + int(teamData[-1]))
                juesha_list = list(set(juesha_list))
                juesha_list.sort(reverse=True)
                if len(juesha_list) > 3:
                    list21 = [k for k, v in juesha_order_dict.items() if v == juesha_list[0]]
                    list22 = [k for k, v in juesha_order_dict.items() if v == juesha_list[1]]
                    list23 = [k for k, v in juesha_order_dict.items() if v == juesha_list[2]]
                    for i in list21:
                        print(leagueDict[i], juesha_dict[i])
                    for i in list22:
                        print(leagueDict[i], juesha_dict[i])
                    for i in list23:
                        print(leagueDict[i], juesha_dict[i])
                else:
                    print('样本太少，无法得到有效的绝杀数据')
            # 近期状态
            if data[0].strip() == 'totalScore':
                list3 = data[1].strip()[2:-2].replace("'", "").split('},{')
                zhuangtaiTeamDataList = []
                for listc in list3:
                    listd = []
                    temp4 = listc.split(',')
                    for temp3 in temp4:
                        listd.append(temp3)
                    zhuangtaiTeamDataList.append(listd)
                '''
                  liste是个二维数组，记录着赢盘榜排名，现在要找出赢盘率大于60的球队
                '''
                zhuangtai_order_dict = collections.OrderedDict()
                zhuangtai_dict = {}
                zhuangtai_list = []
                for teamData in zhuangtaiTeamDataList:
                    '''
                      拿到每个队近6轮的胜平负数据，进行计算
                    '''
                    team_score = 0
                    i = 7
                    while i > 1:
                        if teamData[-i] == '0':
                            team_score += 3
                        elif teamData[-i] == '1':
                            team_score += 1
                        i = i - 1
                    zhuangtai_order_dict[teamData[2]] = team_score
                    zhuangtai_dict[teamData[2]] = team_score
                    zhuangtai_list.append(team_score)
                    # print("%s %s" % (leagueDict[teamData[2]], team_score))
                    # print(teamData)
                zhuangtai_list = list(set(zhuangtai_list))
                zhuangtai_list.sort(reverse=True)
                for i in range(0, len(zhuangtai_list)):
                    list31 = [k for k, v in zhuangtai_order_dict.items() if v == zhuangtai_list[i]]
                    for k in list31:
                        print(leagueDict[k], zhuangtai_dict[k])
        pass
