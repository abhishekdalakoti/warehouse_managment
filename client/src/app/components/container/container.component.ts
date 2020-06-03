import { Component, OnInit } from '@angular/core';
import { ContainerService } from 'src/app/services/container.service';
import {Container } from '../../models/container';
import {Inventory } from '../../models/inventory';
import { InventoryService } from 'src/app/services/inventory.service';
import { AlertService } from 'src/app/_alert';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {
  present_containers:Container[];
  present_c:Container;
  present_inventories:Inventory[];

  constructor(private containerservice : ContainerService,private inventoryservice:InventoryService,
    private alertservice: AlertService,private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit(): void {
  
        this.containerservice.getcontainerslist().subscribe(
      (data : any) => {
        for(var i in data){
          data[i].hold_id=data[i].hold_id==null?[]:data[i].hold_id.split(",");
          data[i].hold_type=data[i].hold_type==1?"container":"inventory"
         
        }
        this.present_containers=data;
         console.log(data); 
        console.log(this.present_containers);
        
      }
    );
    this.inventoryservice.getinventorylist().subscribe(
      (data : any) => {
        this.present_inventories=data;

       
      }
    );
  };
  deleteinventory(id:number){
        this.inventoryservice.deleteinventory(id).subscribe((info:any)=>{
          if(info){
            console.log(info);
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/']);
           
          }
          else{
            this.alertservice.error("Error occured while deleting", true)
          }
        }
        
        );
      
        
     
    
    
  }



  deletecontainer(id:number){
    this.containerservice.isdeletable(id).subscribe((data:any)=>{
      if(!data){
        this.alertservice.error("Cant be deleted as not empty", true)
      }
      else{

        this.containerservice.deletecontainer(id).subscribe((info:any)=>{
          if(info){
            console.log(info);
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/']);
           
          }
          else{
            this.alertservice.error("Error occured while deleting", true)
          }
        }
        
        );
      
        
      }
    });
    
    
  }
 view_detail(data:Container){
this.present_c=data;
 }
}
