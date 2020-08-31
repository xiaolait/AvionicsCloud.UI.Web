import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import {ControlServiceService} from "../control-service.service";

@Component({
  selector: 'app-control-page',
  templateUrl: './control-page.component.html',
  styleUrls: ['./control-page.component.less']
})
export class ControlPageComponent implements OnInit {
  planes = [];
  weapons = [];
  surveys = [];
  weaponChecked = "";
  weaponDevChecked = "";
  surveyChecked = "";
  canLaunch = true;
  weaponInfo = "";
  surveyInfo = "";
  surveyAddr = "";
  surveyPort = "";


  weaponInfoSet = ["武器ID", "已占位","已上电准备好","目标位置已装订","导引头已截获", "发射条件已满足"];
  surveyInfoSet = ["光雷ID", "已启动","自检正常","进入TWS工作模式","目标已发现", "目标已识别","目标已稳定跟踪"];
  launchInfoSet = ["发射按钮已按下", "导弹已发射"];
  lng = 0;
  lat = 0;
  het = 0;

  constructor(private message: NzMessageService, private controlService :ControlServiceService) { }

  checkWeapon(name : any, dev : any){
    if(this.weaponChecked === ""){
      this.weaponChecked = name;
      this.weaponDevChecked = dev;
      this.weapons.filter(item => item.name !== name).forEach(item => (item.disable = true));
      this.weapons.filter(item => item.dev !== dev).forEach(item => (item.disable = true));
    } else {
      this.weaponChecked = "";
      this.weaponDevChecked = "";
      this.weapons.forEach(item => (item.disable = false));
    }
  }

  checkSurvey(dev : any){
    if(this.surveyChecked === ""){
      this.surveyChecked = dev;
      this.surveys.filter(item => item.dev !== dev).forEach(item => (item.disable = true));
    } else {
      this.surveyChecked = "";
      this.surveys.forEach(item => (item.disable = false));
    }
  }

  startWar(){
    if(this.weaponChecked === "" || this.surveyChecked === ""){
      this.message.error("请选择武器和探测传感器");
    } else {
      var weapon = this.weapons.find(a => (a.name === this.weaponChecked && a.dev === this.weaponDevChecked));
      this.printWeapon(0, weapon);
      this.canLaunch = false;
      this.search();
    }
  }

  search(){
    if(this.surveyChecked === ""){
      this.message.error("请选择探测传感器");
    } else {
      var survey = this.surveys.find(a => a.dev === this.surveyChecked);
      this.surveyAddr = survey.addr;
      this.surveyPort = survey.port;

      this.getPlaneSearch();
      this.printSearch(0, survey);
    }
  }

  getPlaneSearch(){
    this.controlService.getplaneSurvey(this.surveyAddr, this.surveyPort).subscribe(input =>{
      if(input){
        this.lng = input["longitude"];
        this.lat = input["latitude"];
        this.het = input["altitude"];
      }
    })
    setTimeout(() => {this.getPlaneSearch();}, 1000);
  }

  launch(){
    var weapon = this.weapons.find(a => (a.name === this.weaponChecked && a.dev === this.weaponDevChecked));

    this.controlService.postplaneWeaponInfo(weapon.addr, weapon.port, weapon.name, weapon.num).subscribe(input =>{
      this.printLaunch(0);
      this.canLaunch = true;
    }) 
  }

  printWeapon(i, weapon){
    if(i < this.weaponInfoSet.length){
      if(i === 0){
        this.weaponInfo += this.weaponInfoSet[i] + ":" + weapon.name + "  " + weapon.dev + "\n";
      } else {
        this.weaponInfo += this.weaponInfoSet[i] + "\n";
      }
      setTimeout(() => {this.printWeapon(i+1, weapon);}, 2000);
    }
  }

  printSearch(i, survey){
    if(i < this.surveyInfoSet.length){
      if(i === 0){
        this.surveyInfo += this.surveyInfoSet[i] + ":" + survey.name + "  " + survey.dev + "\n";
      } else {
        this.surveyInfo += this.surveyInfoSet[i] + "\n";
      }
      setTimeout(() => {this.printSearch(i+1, survey);}, 2000);
    }
  }

  printLaunch(i){
    if(i < this.launchInfoSet.length){ 
      this.weaponInfo += this.launchInfoSet[i] + "\n";     
      setTimeout(() => {this.printLaunch(i+1);}, 3000);
      setTimeout(() => {this.getWeapon();}, 1000);
    }
  }


  getWeapon(){
    this.weapons = [];
    this.weaponChecked = "";
    this.weaponDevChecked = "";

    this.planes.forEach(item =>{
      var planeList = item.planeList;
      planeList.forEach(element => {
        this.controlService.getPlaneWeapon(element.serviceAddress, element.servicePort).subscribe(input =>{
          input.forEach(e =>{
            this.weapons = [...this.weapons, {"addr": element.serviceAddress, "port":element.servicePort, "name":e.type,"num":e.num,"dev":element.name,"disable":false}];
          })
        })
      });    
    })
  }
  
  getSurvey(){
    this.surveys = [];
    this.planes.forEach(item =>{
      var planeList = item.planeList;
      planeList.forEach(element => {
        this.controlService.getplaneSurvey(element.serviceAddress, element.servicePort).subscribe(input =>{
          input.forEach(e =>{
            this.surveys = [...this.surveys, {"addr": element.serviceAddress, "port":element.servicePort,"name":"光雷","dev":element.name,"disable":false}];
          })
        })
      });    
    })
  }

  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };

  ngOnInit() {
    this.planes = [];
//    this.controlService.getplaneList().subscribe(input =>{
//      input.forEach(element => {
        var planeList = [{"serviceAddress":"172.18.67.183", "servicePort":"6100", "serviceName":"plane", "serviceID":"1"}]//element.catalog;
        var tmp = [];
        planeList.forEach(plane => {
          tmp = [...tmp, {"serviceAddress" : plane.serviceAddress, "servicePort" : plane.servicePort, "name" : plane.serviceName + "." + plane.serviceID}]
          this.controlService.getPlaneWeapon(plane.serviceAddress, plane.servicePort).subscribe(input =>{
            input.forEach(e =>{
              this.weapons = [...this.weapons, {"addr": plane.serviceAddress, "port":plane.servicePort, "name":e.type,"num":e.num,"dev":plane.serviceName + "." + plane.serviceID,"disable":false}];
            })
          })

          this.controlService.getplaneSurvey(plane.serviceAddress, plane.servicePort).subscribe(input =>{
            if(input){
              this.surveys = [...this.surveys, {"addr": plane.serviceAddress, "port":plane.servicePort,"name":"光雷","dev":plane.serviceName + "." + plane.serviceID,"disable":false}];
            }
          })
        });

        this.planes = [...this.planes, {"type" : "jxx"/*lement["name"]*/, "planeList" : tmp}];
//      });
//    })
  }
}
