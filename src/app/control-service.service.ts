import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ControlServiceService {

  constructor(private http:HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  addrs = "http://172.18.67.167:30080/services";

  getplaneList(){
    return this.http.get<any[]>(this.addrs);
  }

  getPlaneWeapon(addr : string, port : string){
    //return this.http.get<any[]>("http://" + addr + ":" + port + "/weapons/Weapons");
    return this.http.get<any[]>("/Weapons");
  }

  getplaneSurvey(addr : string, port : string){
    //return this.http.get<any[]>("http://" + addr + ":" + port + "/targets/Targets");
    return this.http.get<any[]>("/Targets");
  }

  postplaneWeaponInfo(addr : string, port : string, type:string, num : string){
    //return this.http.post<any[]>("http://" + addr + ":" + port + "/weapons/Weapons", {"type" : type, "num" : num}, this.httpOptions);
    return this.http.post<any[]>("/Weapons", {"type" : type, "num" : num}, this.httpOptions);
  }
}
