import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

import {toselect} from '../../models/container';
import { ContainerService } from 'src/app/services/container.service';
@Component({
  selector: 'app-add-container',
  templateUrl: './add-container.component.html',
  styleUrls: ['./add-container.component.css']
})
export class AddContainerComponent implements OnInit {
  profileForm = new FormGroup({
    label: new FormControl(''),
    parent: new FormControl(''),
    hold_type:new FormControl('', [Validators.required]),

  });
  isSubmitted = false;
  list_container:toselect[];
  list_inventory:toselect[];
  list_items:toselect[];
  constructor(private containerservice : ContainerService,
     private route : ActivatedRoute,
     private router : Router) { }
  ngOnInit(): void {
    this.containerservice.getcontainerslistbytype(1).subscribe(
      (data : any) => {
       this.list_container=data;
       this.list_items=data;
        
      }
    );
    this.containerservice.getcontainerslistbytype(2).subscribe(
      (data : any) => {
       this.list_inventory=data;
        
      }
    );
  }

  onSubmit() {
    console.log(this.profileForm.value.hold_type);
    this.isSubmitted = true;
    if (!this.profileForm.valid) {
      return false;
    }
    
    if(this.profileForm.value.hold_type!=''){
     this.containerservice.addContainer(this.profileForm.value).subscribe(
       (data:any)=>{
        var routePath = "/";
        this.router.navigate([routePath]);
       }
     )
       
    }
  }
}
