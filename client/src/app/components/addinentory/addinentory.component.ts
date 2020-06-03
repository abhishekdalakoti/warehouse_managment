import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_alert';

import {toselect} from '../../models/container';
import { ContainerService } from 'src/app/services/container.service';
import {InventoryService} from 'src/app/services/inventory.service';
@Component({
  selector: 'app-addinentory',
  templateUrl: './addinentory.component.html',
  styleUrls: ['./addinentory.component.css']
})
export class AddinentoryComponent implements OnInit {
  list_inventory:toselect[];
  isSubmitted = false;
  profileForm = new FormGroup({
    label: new FormControl(''),
    parent: new FormControl(''),

  });
  constructor(private containerservice : ContainerService,
    private route : ActivatedRoute,
    private router : Router,private inventoryservice:InventoryService,private alertservice:AlertService) { }

  ngOnInit(): void {
    this.containerservice.getcontainerslistbytype(2).subscribe(
      (data : any) => {
       this.list_inventory=data;
        
      },
      
    );
  }
  onSubmit() {
    
    if(this.profileForm.value.label!=''){
     this.inventoryservice.addinventory(this.profileForm.value).subscribe(
       (data:any)=>{
        var routePath = "/";
        this.router.navigate([routePath]);
       },
       (error:any)=>{
         this.alertservice.error("FIRST SELECT A CONTAINER",true);
         var routePath = "/";
         this.router.navigate([routePath]);

       }
     )
       
    }
  }

}
