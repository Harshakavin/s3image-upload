import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../shared/api.service';
import {HttpRequest} from '@angular/common/http';
import {element} from 'protractor';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  myform: FormGroup;
  file: any = null;
  Error: any = '';
  timer: any;
  selectImage: any;
  public uploadLoading = 0;
  public  images: any[] = [];
  private formdata: FormData = new FormData();
  constructor(private apiService: ApiService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getAllImages();
    this.myform = this.fb.group({
      name: ['', Validators.required],
      avatar: null
    });
  }

  public onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files  && event.target.files.length > 0) {
      this.file = event.target.files[0];
       this.formdata.append('file', this.file);
       console.log('got file');
       this.myform.controls['name'].setValue(this.file.name);
       this.Error = 'File Selected';
      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //   this.form.get('avatar').setValue({
      //     filename: file.name,
      //     filetype: file.type,
      //     value: reader.result.split(',')[1]
      //   });
      // };
    }
  }

  public uploadFile() {
    if (this.file) {
      this.loading();
      this.Error = 'Working.....';
      this.apiService.pushFileToStorage(this.file).subscribe((data) => {
         console.log(data.partialText);
         if (data.partialText) {
           this.getAllImages();
           // this.images.push(data.partialText.toString());
           this.uploadLoading = 100;
           clearInterval(this.timer);
            this.Error = 'Upload successful';
                    setTimeout(() => {
           this.Error = '';
        }, 3000);
         }

      }, (err) => {
         console.log(err);
          this.Error = 'Upload Fail';
          setTimeout(() => {
           this.Error = '';
        }, 3000);
      });
    }else {
      this.Error = 'Please select an image.';
          setTimeout(() => {
           this.Error = '';
        }, 3000);
    }
  }
  public loading() {
    this.uploadLoading = 0;
    console.log('called');
    this.timer = setInterval( () => {
          if (this.uploadLoading > 100 ) {
            this.uploadLoading = 90;
          }
          console.log(this.uploadLoading);
            this.uploadLoading++;
    },   1000);
  }

  public getAllImages() {

   this.apiService.get('http://13.127.163.78:8080/s3/images')
    .subscribe((data) => {
         console.log(data._body);
          this.images = [];
         data._body.toString().split(';').forEach(image => {
           this.images.push(image);
         });
         // if (data.partialText) {
         //   this.images.push(data.partialText.toString());
         // }
         // this.Error = 'Upload successful';
         //     setTimeout(() => {
         //   this.Error = '';
        // }, 3000);
      }, (err) => {
         console.log(err);
          this.Error = 'Server Error ! try again later.';
          setTimeout(() => {
           this.Error = '';
        }, 3000);
      });
  }

  public deleteImage(url) {
   this.apiService.delete(url).subscribe((data) => {
         console.log(data);
         if (data.partialText) {
           this.Error = data._body;
           this.Error = data.partialText;
           this.getAllImages();
               setTimeout(() => {
           this.Error = '';
        }, 3000);
         }
      }, (err) => {
         setTimeout(() => {
           this.Error = '';
        }, 3000);
       this.Error = 'Delete Fail';
      });
  }
  public SeleteImage(url){
    this.selectImage = url;
  }

}
