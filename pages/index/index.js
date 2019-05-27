//index.js
//获取应用实例
let sysdate = require('../../utils/date.js');

let time = sysdate.formatDate(new Date());
var lineChart = null;
var util = require('../../utils/util.js');
var wxCharts = require('../../utils/wxcharts.js');
var app = getApp()
Page({
  data: {
    arrHabitsWeeks: [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
    timeID: "",
    firstLog: true,
    imgSrc: "../../img/right_gaitubao_1080x1796.png",
    preIndex: '',
    userInfo: {},
    listID: "",
    listID1: "",
    first: [0,0,0],
    hours: [],  //hours实是分
    mins: [],   //mins实是秒
    habits: ["喝水", "吃个好早餐", "锻炼", "今天感觉棒极了", "充电小睡", "写日记", "创建时间表", "刷牙", "喝茶", "沐浴", "冥想", "学习与研究", "心存感恩", "打扮自己", "排除干扰", "摆脱与创造", "晨间随笔", "清洁与整理", "瑜伽", "给父母打电话", "联系朋友","获取灵感", "记下待办事项", "记录我的时间", "走步", "阅读", "瑜伽", "零邮件箱", "自定义习惯"],
    timeHour: '0',
    timeMin: '00',
    habitlist: "0",
    addAnimation: {},
    zidingyiAnimation:{},
    editAnimation: {},
    buttonAni: {},
    call: "+",
    index: "",
    ifPicker: 0,
    list: [
      {
        todoID: 1,
        todoText: "开启ehabit之旅",
        todoTime: "2:00",
        todoDone: "1:00",
        todoProgress: 50,
        work: true,
        chooseColor: "#ffffff",
      }
    ],
    //可修改数据
    setTime: 1000,//这里是计时时间，一分钟进行一次计时时间
    date1: [],
    week_n_tran_str:["周一","周二","周三","周四","周五","周六","周日"],
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
     
   var that=this;

    wx.getStorage({
      key: 'key1',
      success(res) {
        console.log(res.data)
        that.data.arrHabitsWeeks = res.data;
      }
    })


    this.setData({
      date1: sysdate.getDates(1, time)
    });
    console.log(this.data.date1[0]);
    console.log(this.weekstringTransInt(this.data.date1[0].week));
    console.log('onLoad');
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
    });
    var date = new Date();
    var listID = String(date.getFullYear()) + String(date.getMonth() + 1) + String(date.getDate());
    // var listID1 = String(date.getMonth() + 1) + "月" + String(date.getDate())+ "日" + String(date.getHours()) + "时" + String(date.getMinutes())+"分";
    var listID1 = String(date.getMonth() + 1) + "月" + String(date.getDate()) + "日";
    console.log(date.getDate());
    var hours = [], mins = [];
    for (var i = 0; i < 121; i++) { hours.push(i); };
    for (var i = 0; i < 12; i++) { mins.push(i * 5); };
    that.setData({
      listID: listID,
      listID1: listID1,
      hours: hours,
      mins: mins,
      stayHour: date.getHours(),
      stayMin: date.getMinutes()
    });//格式未19951030这样的格式，这是今天的时间，根据这个值从本地储存获得对应的list
    wx.getStorage({
      key: 'list' + that.data.listID,
      success: function (res) {
        that.setData({
          list: res.data
        });
      },
      fail: function () {
        that.getTodo();
        console.log("获取前一次的数据");
      }
    })//首次打开页面重本地储存获取当天的数据

    wx.getStorage({
      key: "firstLog",
      success: function (res) {
        that.setData({
          firstLog: false,
          imgSrc: ""
        });
      },
    })//判断是否是第一次打开

   //onload报表部分
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: that.data.habits[that.data.habitlist],
        data: that.data.arrHabitsWeeks[that.data.habitlist],   //控制上面的每一个点
        format: function (val, name) {
          return val.toFixed(1);
        }
      }
      ],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '次数',
        format: function (val) {
          return val.toFixed(1);
        },
        min: 0
      },
      width: windowWidth,
      height: 160,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
   
  },
  onShow: function () {
    var that = this;
    var date = new Date();//因为手机锁屏小程序会待机，等到打开才又开始计时，这里得到小程序待机的时间
    var stayHour = date.getHours();
    var stayMin = date.getMinutes();
    var index = that.data.preIndex;
    var list = that.data.list;
    var done = list[index].todoDone;
    var hour = parseInt(done.split(":")[0]);
    var min = parseInt(done.split(":")[1]);
    //判断手机是否经过锁屏，锁完屏的话这里储存的时间会有较大差距
    if ((stayHour === that.data.stayHour && (stayMin - that.data.stayMin < 2)) || ((stayHour === that.data.stayHour + 1) && (stayMin === 0) && (that.data.stayMin === 59))) {
      that.setData({
        stayHour: stayHour,
        stayMin: stayMin
      });
      console.log("未锁屏并储存现在时间为" + stayHour + ":" + stayMin);
    } else {
      var hours = stayHour - that.data.stayHour;
      var mins = stayMin - that.data.stayMin;
      var list = that.data.list;
      console.log("锁屏时间长为" + hours + ":" + mins);
      if (mins >= 0) {
        hour = hour + hours;//加上锁屏经过的时间
        min = min + mins;//加上锁屏经过的时间
      } else {
        hour = hour + hours - 1;
        min = min + mins + 60;
      };
      done = String(hour) + ":" + String(min < 10 ? ("0" + min) : min);
      list[index].todoDone = done;
      that.setData({
        stayHour: stayHour,
        stayMin: stayMin,
        list: list
      });
    };
    
  },
  start: function (e) {
    console.log(e);
    var that = this;
    var list = that.data.list;
    var index = e.currentTarget.id - 1;
    list[index].chooseColor = "#dddddd";
    if (e.changedTouches.length === 1) {
      this.setData({
        startX: e.changedTouches[0].clientX,
        startStamp: e.timeStamp,//这个属性用来判断用户长按时间的长短来判定是否进行删除
        list: list
      });
    }
  },
  move: function (e) {

    this.setData({
      moveX: 1//这个属性来判断用户是否进行了滑动
    });
  },
  end: function (e) {
    var that = this;//有setTimeout时候用this要格外小心，setTimeout里的this在js里指向window，小程序没有window这里指向回调函数本身，setTimeout好像被封装到函数里去了
    console.log(e);
    if (e.changedTouches.length === 1) {

      this.setData({
        endX: e.changedTouches[0].clientX,
      });
      if (this.data.moveX === 1) {
        var index = e.currentTarget.id - 1;//根据这个id定位对应的todo条
        var done = that.data.list[index].todoDone;
        var work = that.data.list[index].work;
        var timeID = that.data.timeID;
        var time = that.data.list[index].todoTime;
        var hour = parseInt(done.split(":")[0]);
        var min = parseInt(done.split(":")[1]);
        var hour1 = parseInt(time.split(":")[0]);
        var min1 = parseInt(time.split(":")[1]);
        if (this.data.startX - this.data.endX > 30) {
          //第一次加载时候的左滑后提示动画
          var date = new Date();
          if (that.data.firstLog) {
            that.setData({
              imgSrc: "../../img/longTap.png",
              stayHour: date.getHours(),
              stayMin: date.getMinutes()
            });
          };

          var list = that.data.list;
          list[index].work = true;
          list[index].chooseColor = "#ffffff";
          that.setData({
            list: list,
          });
          console.log("left");//左滑时发生的事件
          clearInterval(that.data.timeID);//根据设置的timeID停止相应的setInterval,表现为右滑停止计时
          wx.setStorage({
            key: ("list" + that.data.listID),
            data: that.data.list
          });//左滑动储存数据
        } else if (this.data.endX - this.data.startX > 30) {
          console.log("right");//右滑时发生的事件
          //提示动画
          if (that.data.firstLog) {
            that.setData({
              imgSrc: "../../img/left_gaitubao_1080x1796.png"
            });
          };

          if (timeID === "") {
            console.log("前面没有正在运行的todo条");
          } else {
            console.log(timeID);
            var list = that.data.list;
            var date = new Date();
            that.setData({
              stayHour: date.getHours(),
              stayMin: date.getMinutes()
            });
            if (that.data.preIndex < list.length) {
              console.log("preIndex是" + that.data.preIndex);
              list[that.data.preIndex].work = true;
            };
            that.setData({
              list: list,
              preIndex: "",//清空
            });
            clearInterval(timeID);//保证了只有一个timeID定时事件在运行
          };
          var timeID = setInterval(function () {
            if (((hour === hour1) && (min === min1)) || (done === "✓")) {
              console.log("任务已经完成");
              hour = "✓";
              work = true;
              that.data.list[index].todoDone = hour;
              that.data.list[index].work = true;
              var date = new Date();
              that.setData({
                stayHour: date.getHours(),
                stayMin: date.getMinutes()
              });
              wx.setStorage({
                key: "list" + that.data.listID,
                data: that.data.list
              });//时间满了储存数据
              clearInterval(timeID);
            } else {
              var date = new Date();//因为手机锁屏小程序会待机，等到打开才又开始计时，这里得到小程序待机的时间
              var stayHour = date.getHours();
              var stayMin = date.getMinutes();
              //判断手机是否经过锁屏，锁完屏的话这里储存的时间会有较大差距
              if ((stayHour === that.data.stayHour && (stayMin - that.data.stayMin < 2)) || ((stayHour === that.data.stayHour + 1) && (stayMin === 0) && (that.data.stayMin === 59))) {
                that.setData({
                  stayHour: stayHour,
                  stayMin: stayMin
                });
                console.log("未锁屏并储存现在时间为" + stayHour + ":" + stayMin);
              } else {
                var hours = stayHour - that.data.stayHour;
                var mins = stayMin - that.data.stayMin;
                var list = that.data.list;
                console.log("锁屏时间长为" + hours + ":" + mins);
                if (mins >= 0) {
                  hour = hour + hours;//加上锁屏经过的时间
                  min = min + mins;//加上锁屏经过的时间
                } else {
                  hour = hour + hours - 1;
                  min = min + mins + 60;
                };
                done = String(hour) + ":" + String(min < 10 ? ("0" + min) : min);
                list[index].todoDone = done;
                that.setData({
                  stayHour: stayHour,
                  stayMin: stayMin,
                  list: list
                });
              };
              min < 59 ? (min = min + 1) : (min = 0, hour++);
              var work = false;
            }
            var list = that.data.list;
            if (hour !== "✓") {
              done = String(hour) + ":" + String(min < 10 ? ("0" + min) : min);//返回增加后的时间，分钟是一直两位数的，一位要转为两位
              console.log(done);
              list[index].todoDone = done;
              list[index].work = work;
              console.log(that.countProgress(done, list[index].todoTime));
              list[index].todoProgress = Math.floor(that.countProgress(done, list[index].todoTime) * 100);
            } else {
              list[index].todoDone = "✓";//Done=Time时关系数据为“✓”
              list[index].todoProgress = 100;
            }

            that.setData({
              list: list,//更新后的数据存回去
            });
            wx.setStorage({
              key: "list" + that.data.listID,
              data: that.data.list
            });//储存到本地
          }, that.data.setTime);
          var list = that.data.list;
          if (hour === hour1 && min === min1 || done === "✓") {
            console.log("时间相等");
            list[index].work = true;
            list[index].todoDone = "✓";
            list[index].todoProgress = 100;
          } else {
            list[index].work = false;
          };
          that.setData({
            list: list,
            timeID: timeID,
            preIndex: index,//用来在timeID存在即有todo正在计时的情况下，开始新计时时停止旧的计时的兔斯基动画
          });
          wx.setStorage({
            key: '',
            data: '',
          })
        } else {
          //滑动较小进行下面的操作，因为手指基本会进行滑动的，没法按着不动
          if (e.timeStamp - that.data.startStamp > 100) {//长按1s弹出设置模块
            //提示动画
            if (that.data.firstLog) {
              that.setData({
                imgSrc: "../../img/xia1_gaitubao_970x922.png"
              });
            };

            var animation = wx.createAnimation({
              duration: 1000,
              timingFunction: "ease",
              delay: 0,
              transformOrigin: "50% 50% 0",
            });
            var res = wx.getSystemInfoSync();
            var index = e.currentTarget.id - 1;
            var todoTime = that.data.list[index].todoTime;
            var hourID = parseInt(todoTime.split(":")[0]);
            var minID = parseInt(todoTime.split(":")[1]) / 5;
            console.log(res);
            console.log(minID);
            animation.translateY(-res.windowHeight * 0.5).step();
            that.setData({
              editAnimation: animation.export(),
              index: index,//后面编辑这个todo条的时候要用到
              valueID: [hourID, minID],
              editName: that.data.list[index].todoText
            });
          }
        };
      }
    }
    var list = that.data.list;
    var index = e.currentTarget.id - 1;
    list[index].chooseColor = "#ffffff";
    that.setData({
      list: list
    });
  },

  onReady: function () {
    var that = this;
    console.log("onready");
    console.log(that.data.hours);
    console.log(that.data.mins);
  },
  //计时器模块

  //获取今天的数据失败时，调用函数获得最近打开程序保存的数据，并清空todoDone
  getTodo: function () {
    var that = this;
    wx.getStorageInfo({
      success: function (res) {
        console.log(res.keys);
        var keys = res.keys.concat();
        var newKeys = [];
        for (var i = 0; i < keys.length; i++) {
          if (/^list/.test(keys[i])) {
            newKeys.push(keys[i]);
          }
        };
        console.log(newKeys);
        wx.getStorage({
          key: newKeys[newKeys.length - 1],
          success: function (res) {
            var list = res.data.map(function (obj) {
              obj.todoDone = "0:00";
              obj.todoProgress = 0;
              return obj;
            });
            that.setData({
              list: list
            })
          }
        });
      }
    })
  },
  //添加事项模块
  formSubmit: function (e) {

    var that = this;
   
    console.log('addForm发生了submit事件，携带数据为：', e.detail.value);
    //提示动画
    if (that.data.firstLog) {
      that.setData({
        imgSrc: "../../img/welcome.gif"
      });
      setTimeout(function () {
        that.setData({
          imgSrc: "",
          firstLog: false,
        });
        wx.setStorage({
          key: 'firstLog',
          data: false,
        })
      }, 2000);
    };

    var value = e.detail.value;
    var list = that.data.list;
    var obj = {};
    
      that.reduce();//成功后把框收起来
      obj.todoID = list.length + 1;
      obj.todoText = String(that.data.habits[that.data.habitlist]);
      obj.work = true;
      obj.todoTime = (String(that.data.timeHour) + ":" + String(that.data.timeMin > 1 ? that.data.timeMin * 5 : "0" + that.data.timeMin * 5)); //滑块获得的是，不管数字是谁1，2，3，，4，5，
      obj.todoDone = "0:00";
      obj.todoProgress = 0;
      list.push(obj);
      that.setData({
        list: list
      });
      wx.setStorage({
        key: ("list" + that.data.listID),
        data: list
      });//储存数据
    var date = new Date();
    var that = this;

    


    that.data.arrHabitsWeeks[that.data.habitlist][this.weekstringTransInt(this.data.date1[0].week)]++;

    wx.setStorage({
      key: 'key1',
      data: that.data.arrHabitsWeeks,
      success: function (res) {
        console.log('异步保存成功')
      }
    })

    wx.getStorage({
      key: 'key1',
      success(res) {
        console.log(res.data)
        that.data.arrHabitsWeeks = res.data;
      }
    })

    console.log(that.data.arrHabitsWeeks[that.data.habitlist][this.weekstringTransInt(this.data.date1[0].week)]);
    that.updateData();


    var data = '123'
    var data_n = ''
    data_n = parseInt(data);
     console.log("数字转字符串"+data_n);
  },
  zidingyiformSubmit: function (e) {
    var that = this;
    console.log('addForm发生了submit事件，携带数据为：', e.detail.value);
    //提示动画
    if (that.data.firstLog) {
      that.setData({
        imgSrc: "../../img/welcome.gif"
      });
      setTimeout(function () {
        that.setData({
          imgSrc: "",
          firstLog: false,
        });
        wx.setStorage({
          key: 'firstLog',
          data: false,
        })
      }, 2000);
    };

    var value = e.detail.value;
    var list = that.data.list;
    var obj = {};
    if (value.todoName === "") {
      wx.showModal({
        title: '提示',
        content: '还没输入任务名哦',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
    } else {
      that.zidingyireduce();//成功后把框收起来
      obj.todoID = list.length + 1;
      obj.todoText = value.todoName;
      obj.work = true;
      obj.todoTime = (String(that.data.timeHour) + ":" + String(that.data.timeMin > 1 ? that.data.timeMin * 5 : "0" + that.data.timeMin * 5));
      obj.todoDone = "0:00";
      obj.todoProgress = 0;
      list.push(obj);
      that.setData({
        list: list
      });
      wx.setStorage({
        key: ("list" + that.data.listID),
        data: list
      });//储存数据
    };
  },
  
  pickerChange: function (e) {
    var that = this;
    console.log(e);
    that.setData({
      habitlist: e.detail.value[0],
      timeHour: e.detail.value[1],
      timeMin: e.detail.value[2],
      ifPicker: 1
    });
  },
  editPickerChange: function (e) {
    var that = this;
    console.log(e);
    that.setData({
      timeHour: e.detail.value[0],
      timeMin: e.detail.value[1],
      ifPicker: 1
    });
  },

  zidingyipickerChange: function (e) {
    var that = this;
    console.log(e);
    that.setData({
      timeHour: e.detail.value[0],
      timeMin: e.detail.value[1],
      ifPicker: 1
    });
  },
  //添加事项的动画
  add: function () {
    console.log("弹出设置页面");
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50% 0",
    });
    var ani = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    });
    ani.width(0).height(0).step();
    var res = wx.getSystemInfoSync();
    console.log(res);
    animation.translateY(-res.windowHeight * 0.5).step();
    that.setData({
      addAnimation: animation.export(),
      buttonAni: ani.export(),
      call: "+"
    });
  },

  zidingyiadd: function () {
    console.log("弹出设置页面");
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50% 0",
    });
    var ani = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    });
    ani.width(0).height(0).step();
    var res = wx.getSystemInfoSync();
    console.log(res);
    animation.translateY(-res.windowHeight * 0.5).step();
    that.setData({
      zidingyiAnimation: animation.export(),
      buttonAni: ani.export(),
      call: "+"
    });
  },
  cancel: function () {
    //提示动画
    var that = this;
    if (that.data.firstLog) {
      that.setData({
        imgSrc: "../../img/welcome.gif"
      });
      setTimeout(function () {
        that.setData({
          imgSrc: "",
          firstLog: false,
        });
        wx.setStorage({
          key: 'firstLog',
          data: false,
        })
      }, 2000);
    };

    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50% 0",
    });
    var res = wx.getSystemInfoSync();
    console.log(res);
    animation.translateY(res.windowHeight * 0.5).step();
    that.setData({
      addAnimation: animation.export(),
      
      

    });
  },
  zidingyicancel: function () {
    //提示动画
    var that = this;
    if (that.data.firstLog) {
      that.setData({
        imgSrc: "../../img/welcome.gif"
      });
      setTimeout(function () {
        that.setData({
          imgSrc: "",
          firstLog: false,
        });
        wx.setStorage({
          key: 'firstLog',
          data: false,
        })
      }, 2000);
    };

    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50% 0",
    });
    var res = wx.getSystemInfoSync();
    console.log(res);
    animation.translateY(res.windowHeight * 0.5).step();
    that.setData({
      zidingyiAnimation: animation.export(),



    });
  },
  //清理localstorage
  clear: function () {
    var that = this;
    var ani = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    });
    ani.width(0).height(0).step();
    that.setData({
      buttonAni: ani.export(),
      call: "+"
    })
    wx.showModal({
      title: '提示',
      content: '确认清除本小程序所有习惯条？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.clearStorage();
          that.setData({
            list: [
              {
                todoID: 1,
                todoText: "开启ehabit之旅",
                todoTime: "2:00",
                todoDone: "1:00",
                todoProgress: 50,
                work: true,
                chooseColor: "#ffffff",
              }
            ]
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  reduce: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50% 0",
    });
    var res = wx.getSystemInfoSync();
    console.log(res);
    animation.translateY(res.windowHeight * 0.5).step();
    that.setData({
      addAnimation: animation.export(),
     

     
      call: "+"
    });//设置完成之后也收起来
  },

  zidingyireduce: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50% 0",
    });
    var res = wx.getSystemInfoSync();
    console.log(res);
    animation.translateY(res.windowHeight * 0.5).step();
    that.setData({
      zidingyiAnimation: animation.export(),



      call: "+"
    });//设置完成之后也收起来
  },

  //删除和修改事项
  del: function (e) {
    var that = this;
    var list = that.data.list;
    console.log(that.data.index);
    console.log(list.splice(that.data.index, 1));
    that.setData({
      list: list,
    });
    wx.setStorage({
      key: ("list" + that.data.listID),
      data: list
    });//储存数据
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50% 0",
    });
    var res = wx.getSystemInfoSync();
    console.log(res);
    animation.translateY(res.windowHeight * 0.5).step();
    that.setData({
      editAnimation: animation.export(),
    });//设置完成之后也收起来
  },
  editSubmit: function (e) {
    var that = this;
    var value = e.detail.value;
    var list = that.data.list;
    var index = that.data.index;
    var obj = that.data.list[index];
    console.log('editForm发生了submit事件，携带数据为：', e.detail.value);
    if (value.todoName === "") {
      wx.showModal({
        title: '提示',
        content: '还没输入任务名哦',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
    } else {
      obj.todoText = value.todoName;
      if (that.data.ifPicker === 1) {
        obj.todoTime = (String(that.data.timeHour) + ":" + String(that.data.timeMin > 1 ? that.data.timeMin * 5 : "0" + that.data.timeMin * 5));
        obj.todoDone = "0:00";
        obj.todoProgress = "0"
      };
      list.splice(that.data.index, 1, obj);
      that.setData({
        list: list,
        ifPicker: 0
      });
      wx.setStorage({
        key: ("list" + that.data.listID),
        data: list
      });//储存数据
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease",
        delay: 0,
        transformOrigin: "50% 50% 0",
      });
      var res = wx.getSystemInfoSync();
      console.log(res);
      animation.translateY(res.windowHeight * 0.5).step();
      that.setData({
        editAnimation: animation.export(),
      });//设置完成之后也收起来
    };
  },
  //计算progress
  countProgress: function (a, b) {
    var t = parseInt(b) * 60 + parseInt(b.split(":")[1]);
    var d = parseInt(a) * 60 + parseInt(a.split(":")[1]);
    return ((d / t).toFixed(2));
  },
  //悬浮按钮的动画
  float: function () {
    var that = this;
    var ani = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    });
    if (that.data.call === "+") {
      var call = "-";
      ani.width(40).height(40).rotate(360).step();
    } else {
      var call = "+";
      ani.width(0).height(0).step();
    }
    console.log(ani);
    console.log("唤出按钮");
    that.setData({
      buttonAni: ani.export(),
      call: call
    });
  },
  //报表的处理函数
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },    
  createSimulationData: function () {
    var that = this;
    var categories = [];
    var data = that.data.arrHabitsWeeks[that.data.habitlist];
    for (var i = 0; i < 7; i++) {   //控制下面的每日 可以改为月 年
      categories.push(that.data.week_n_tran_str[i]);
       
    }
    
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  }, 
  updateData: function () {
    var that = this;
    var simulationData = this.createSimulationData();
    var series = [{
      name: that.data.habits[that.data.habitlist],
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(1);
      }
    }
    ];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series
    });
  },
   weekstringTransInt(weeks) {
    var that=this;
    if(weeks==="周一")
    return "0";
    else if(weeks==="周二")
    return "1";
    else if (weeks === "周三")
      return "2";
    else if (weeks === "周四")
      return "3";
    else if (weeks === "周五")
      return "4";
    else if (weeks === "周六")
      return "5";
    else if (weeks === "周日")
      return "6";
},
  clearbaobiao()
  { var that=this;
    wx.showModal({
      title: '提示',
      content: '确认清除本小程序习惯统计图？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            arrHabitsWeeks: [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
          });
          that.updateData();
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

    
  } 
  

})
