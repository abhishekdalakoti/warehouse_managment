import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import {Container } from '../../Models/container';

import {toselect} from '../../Models/container';
import { ContainerService } from 'src/app/services/container.service';
@Component({
  selector: 'app-move-container',
  templateUrl: './move-container.component.html',
  styleUrls: ['./move-container.component.css']
})
export class MoveContainerComponent implements OnInit {
  profileForm = new FormGroup({
    to_move: new FormControl(''),
    to: new FormControl(''),
  });
  parent:number;
  to_move:number;
  to:number;
 container_initial:Container[];
 container_final:number[];
str:string;
error=false;
  constructor(private containerservice : ContainerService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit(): void {
    this.str="Choose your Destination Container";
    this.containerservice.getcontainerslist().subscribe(
      (data : any) => {
        
        this.container_initial=data;
         //console.log(data); 
        //console.log(this.present_containers);
        
      }
    );
  }
 movable(event:any){
   
   var id =event.target.value;
   console.log(id);
   id=id.split(":");
   console.log(id);
   id=parseInt(id[1].trim());
   console.log(id);
   
  this.containerservice.getposiblemoveablecontainer(id).subscribe((data:any)=>{
    if(data.length==0){
      this.str="NO EMPTY CONTINER MATCHING THE REQUIRMENT LEFT"
    }
    else{
      this.str="Choose your Destination Container";
    this.container_final=data;
    }
  },
  (error:any)=>{
    console.log(error);
  })
 }
 onSubmit() {
   console.log(this.profileForm.value);
  if((this.profileForm.value.to_move=='')||(this.profileForm.value.to=='')){
    this.error=true;
  }
  else{
    this.error=false;
  }

 if(!this.error){
   var id=this.profileForm.value.to_move;
  this.containerservice.getcontainerbyid(id).subscribe(
     (data:any)=>{
   this.parent=data.parent;
   }
   )

   this.containerservice.movecontainer(this.profileForm.value.to,this.parent,this.profileForm.value.to_move).subscribe(
(data:any)=>{
  console.log(data);
  this.router.navigate(['/']);
}
   );


 }
}
}
