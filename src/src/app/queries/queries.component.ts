import { Component, Output, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { QueriesService } from '../shared/services/queries/queries.service';
import { FormBuilder, FormControl, FormGroup,FormArray } from '@angular/forms';
import { PublishService } from '../shared/services/publish/publish.service';
import 'rxjs/Rx' ;
import { AuthserviceService } from '../shared/services/login/authservice.service';
import { IonServer } from '../shared/globals/global';
@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  providers: [QueriesService, AuthserviceService,PublishService],
  styleUrls: ['./queries.component.css']
})
export class QueriesComponent implements OnInit {
  queriesData: any = [];
  querieTemplatesData: any = [];
  // unansweredData: any = [];
  activeClassName: string = 'active';
  eachQuerieData: any = [];
  eachquerie:any =[];
  isShowUser: boolean = false;
  userDispalyData: any = {};
  isQuickReply: boolean = false;
  questionId: any = '';
  templateData: string = '';
  isAddtoQuickReply: boolean = false;
  isIonizeQuery:boolean=false;
  imageerrorAlert:boolean=false;
  isStartLoader;
  querieID: string = '';
  querieTitle: string = '';
  isShowTransferQuery: boolean = false;
  categoriesList:any=[];
  isQuerieEdit: boolean = false;
  imageSrc: any = [];
  imgerror="Choose Only Image.";
  imgsize="The file size can not exceed 8MB.";
  isEditClick: boolean = false
  editContent="";
  editId="";
  spaceComment=IonServer.Space_Not_required;
  @ViewChild('fileQuerieInput') fileQuerieInput;
  patientQuerieForm: FormGroup = this.builder.group({
    subject: new FormControl(''),
    querie: new FormControl('')
  });
  singleQuerieData: any = {};
  // publish to web site
  publishOrNot:boolean=false;
  publishOrNotValue:number=1;
  isAlertPopup: boolean = false;
  isDeleteAlertPopup: boolean = false;
  alertMessage: string = '';
  querieTypeText: string = '';
  queriesTab:string="";
  startFrom=0;
  limit=15;
  imageUploadAlert: boolean = false;
  createTheBlogForm: FormGroup = this.builder.group({
    title: new FormControl(''),
    content:new FormControl(''),
    type:new FormControl(''),
    image:new FormControl(''),
    topicId:new FormControl(''),
    status:new FormControl(''),
    createdDate:new FormControl(''),
    createdTime:new FormControl('')
  });
  // publish to web site values
  @ViewChild('usercontainer') usercontainer;
  @ViewChild('transfercontainer') transfercontainer;
  @ViewChild('answerData') answerData;
  @ViewChild('editcontainer') editcontainer;

  constructor(private router: Router, private quriesService: QueriesService,
    private builder: FormBuilder,private route: ActivatedRoute, private authService: AuthserviceService,
    private publishService: PublishService) {
    document.addEventListener('click', this.offClickHandler.bind(this));
    document.addEventListener('click', this.transferClickHandler.bind(this));
    document.addEventListener('click', this.querieEditOrDelete.bind(this));
  }

 
  offClickHandler(event: any) {
    if (this.usercontainer && !this.usercontainer.nativeElement.contains(event.target)) {
        this.isShowUser = false;
    }
}
transferClickHandler(event: any) {
  if (this.transfercontainer && !this.transfercontainer.nativeElement.contains(event.target)) {
    this.isShowTransferQuery = false;
    this.showTrasferError=false;
 } 
}

querieEditOrDelete(event: any) {
  if (this.editcontainer && !this.editcontainer.nativeElement.contains(event.target)) {
    this.queriesData.forEach((eachData) => {
     eachData.isClickOnDottedLine = false;
   });
 }
}
  // @ViewChild('mainContainer') container;
  ngOnInit() {
    if (localStorage.getItem('user') == '' || localStorage.getItem('user')==null) {
      this.router.navigate(['login']);
    } else {
      
      this.getCategories();
      this.route.params.forEach((params: Params) => {
        this.getQueriesBasedOnUrlStauts();
        if (params.qId !== '' && params.qId !== undefined) {
          console.log(params.qId);
          this.querieID = params.qId;
        }
      });
    }

     
  }
   getQueriesBasedOnUrlStauts(){
      if (this.router.url == '/queries') {
        this.queriesTab='unanswered';
        this.querieTypeText = 'unanswered';
        this.getAllUnansweredQueries();
        this.startFrom=0;
      }
      else if (this.router.url == '/queries/answered') {
        this.queriesTab='answered';
        this.querieTypeText = 'answered';
        this.getAllAnsweredQueries();
        this.startFrom=0;
      }
      else if (this.router.url == '/queries/popular') {
        console.log("popular");
        this.queriesTab='popular';
        this.querieTypeText = 'popular';
        this.getQueries();
        this.startFrom=0;
      }
    }

  // Getting All queries
  showNoQueriesAvailable=false;
 getQueries() {
  this.isStartLoader = true;
  this.showNoQueriesAvailable=false;
  this.queriesData=[];
  this.quriesService.getAllQueries(this.startFrom,this.limit).subscribe(
    (queriesResponse: any) => {
      console.log(queriesResponse);
      this.fetchingQueriesLength=queriesResponse.posts.length;
      this.queriesData = this.queriesData.concat(queriesResponse.posts);
      if(this.queriesData.length==0)
        {
          this.showNoQueriesAvailable=true;
        }
        else{
          this.showNoQueriesAvailable=false;
        }
       if(this.startFrom==0)
            this.showQueries(this.queriesData[0]);
      this.startFrom=this.startFrom+this.limit;
     
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      this.queriesData.forEach((eachData) => {
        eachData.isClickOnDottedLine = false;
      });
        
    });
}
 // Getting All answered queries
 fetchingQueriesLength=0;
 getAllAnsweredQueries() {
  this.queriesData=[];
  this.isStartLoader = true;
  this.showNoQueriesAvailable=false;
  this.quriesService.getAnsweredQueries(this.startFrom,this.limit).subscribe(
    (queriesResponse: any) => {
      this.fetchingQueriesLength=queriesResponse.posts.length;
      this.queriesData = this.queriesData.concat(queriesResponse.posts);
      // console.log(queriesResponse);
      // this.queriesData = queriesResponse.posts;
      if(this.queriesData.length==0)
        {
          this.showNoQueriesAvailable=true;
        }
        else{
          this.showNoQueriesAvailable=false;
        }
       if(this.startFrom==0)
            this.showQueries(this.queriesData[0]);
      this.startFrom=this.startFrom+this.limit;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      this.queriesData.forEach((eachData) => {
        eachData.isClickOnDottedLine = false;
      });
    });
}

 // Getting All unanswered queries
 getAllUnansweredQueries() {
  this.isStartLoader = true;
  this.showNoQueriesAvailable=false;
  this.queriesData=[];
  this.quriesService.getUnAnsweredQueries(this.startFrom,this.limit).subscribe(
    (queriesResponse: any) => {
      console.log(queriesResponse);
      this.fetchingQueriesLength=queriesResponse.posts.length;
      this.queriesData = this.queriesData.concat(queriesResponse.posts);
      //this.queriesData = queriesResponse.posts;
      if(this.queriesData.length==0)
        {
          this.showNoQueriesAvailable=true;
        }
        else{
          this.showNoQueriesAvailable=false;
        }
       if(this.startFrom==0)
            this.showQueries(this.queriesData[0]);
            this.startFrom=this.startFrom+this.limit;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      this.queriesData.forEach((eachData) => {
        eachData.isClickOnDottedLine = false;
      });
    });
}
// get detail querie call
getDetailsEachQuerie(id) {
  this.isStartLoader = true;
  this.quriesService.getDetailQuerie(id).subscribe(
    (queriesResponse: any) => {
      console.log(queriesResponse);
      this.eachQuerieData = queriesResponse.posts;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      if (this.eachQuerieData.length > 0) {
        if (this.eachQuerieData[0].user_id === '0') {
          this.userDispalyData = this.eachQuerieData[0];
        } else if (this.eachQuerieData[1].user_id === '0') {
          this.userDispalyData = this.eachQuerieData[1];
        }
      }
    });
}
 
isReplyEmpty=false;
// Answer to a querie
answerAQuerie(replyData, qId) {
  console.log(qId);
  if(this.publishOrNot==true)
      {
        this.publishOrNotValue=0;
      }
      else{
        this.publishOrNotValue=1;
      }
  //return;
  replyData=replyData.trim();
  console.log(replyData);
  if(replyData=='')
    {
      this.isReplyEmpty=true;
    }
    else{
      var attachments="";
      console.log(this.imageSrc);
      if(this.imageSrc.length>0)
        {
          attachments="&attachments="+this.imageSrc.length;
          this.imageSrc.forEach((image,key)=>{
            attachments=attachments+"&attachment"+(key+1)+"="+image;
          })
        }
        console.log(attachments);
        
        this.isStartLoader = true;
        console.log(btoa(replyData));
        this.quriesService.addAnswerToQuerie(btoa(replyData), qId,this.publishOrNotValue,attachments).subscribe(
        (qResponse: any) => {
          console.log(qResponse);
          this.imageSrc=[];
          // this.queriesData = qResponse;
        }, (err) => {
               console.log(err);
        }, () => {
          this.isStartLoader = false;
          if (this.isAddtoQuickReply) {
            this.addQuerieTemplate(replyData);
          }
          this.isQuickReply = false;
          this.getDetailsEachQuerie(qId);
        });
    }
  
}
// geting all querie templates
// getQuerieTemplates(index) {
//   this.isStartLoader = true;
//   let navItem: any;
//   for (navItem of this.queriesData) {
//     if (navItem.activeclass === this.activeClassName) {
//       navItem.activeclass = '';
//     }
//   }
//   this.queriesData[index].activeclass = this.activeClassName;
//   this.isQuickReply = true;
//   this.quriesService.getQuerieReplyTemplates().subscribe(
//     (queriesResponse: any) => {
//       console.log(queriesResponse);
//       this.querieTemplatesData = queriesResponse.description;
//     }, (err) => {

//     }, () => {
//       this.isStartLoader = false;
//       this.showTemplates(0);
//     });
// }
// adding querie template
addQuerieTemplate(tempData) {
  this.isStartLoader = true;
  this.quriesService.addQuerieReplyTemplate(tempData).subscribe(
    (qResponse: any) => {
      console.log(qResponse);
      this.isAddtoQuickReply=false;
      // this.queriesData = qResponse;
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
      this.isQuickReply = false;
      //this.showQueries(0);
    });
}

showTemplates(index) {
  let tempItem: any;
  for (tempItem of this.querieTemplatesData) {
    if (tempItem.activeclass === this.activeClassName) {
      tempItem.activeclass = '';
    }
  }
  
  this.querieTemplatesData[index].activeclass = this.activeClassName;
  this.templateData = this.querieTemplatesData[index].content; 
}

// showQueries(Index: any) {
//     let navItem: any;
//     if(this.queriesData.length > 0) {
//       for (navItem of this.queriesData) {
//         if (navItem.activeclass === this.activeClassName) {
//           navItem.activeclass = '';
//         }
//       }
//       this.queriesData[Index].activeclass = this.activeClassName;
//       this.querieTitle = this.queriesData[Index].title;
//       this.getDetailsEachQuerie(this.queriesData[Index].id);
//       this.questionId = this.queriesData[Index].id;
//       this.isQuickReply = false;
//       // if(this.answerData && !this.answerData.nativeElement.disabled) {
//       //   this.answerData.nativeElement.focus();
//       // }

//     }
// }
  downloadQuries(){
    console.log("download");
    this.isStartLoader=true;
    this.quriesService.dowmloadQuries().subscribe(
    (qResponse: any) => {
      this.downloadFile(qResponse); 
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
    });
  }
  downloadFile(data: Response){
     let parsedResponse = data;
    let blob = new Blob([parsedResponse], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
     let a = document.createElement('a');
        a.href = url;
        a.download = 'questions.csv';
        document.body.appendChild(a);
        a.click();        
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isStartLoader=false;
}

getCategories(){
 
  this.quriesService.getQueryCategories().subscribe(
    (categories: any) => {
      console.log(categories.description);
      this.categoriesList=categories.description;
     // this.downloadFile(categories); 
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
    });
}
showTrasferError=false;
transferQuery(catid){
  console.log(catid);
  
  if(catid!='')
    {
      this.showTrasferError=false;
        this.isStartLoader=true;
        this.quriesService.queryTrasfer(catid,this.questionId).subscribe(
          (queryTranser: any) => {
            console.log(queryTranser);
            this.isStartLoader=false;
            this.isShowTransferQuery = false;
              this.getQueriesBasedOnUrlStauts();
          }, (err) => {

          }, () => {
            this.isStartLoader = false;
          });
    }
        else{
          this.showTrasferError=true;
        }
  
}
categorySelected(catid)
        {
          if(catid=='')
            {
              this.showTrasferError=true;
            }
            else{
              this.showTrasferError=false;
            }
        }
  showQueries(eachquerie) {
  let navItem: any;
  //console.log(eachquerie);
  this.imageSrc=[];
  if(this.queriesData.length > 0) {
    for (navItem of this.queriesData) {
      if (navItem.activeclass === this.activeClassName) {
        navItem.activeclass = '';
      }
      else if(navItem.id===eachquerie.id)
        {
                navItem.activeclass = this.activeClassName;
        }
    }

    eachquerie.activeclass = this.activeClassName;
    this.querieTitle = eachquerie.title;
    this.getDetailsEachQuerie(eachquerie.id);
    this.questionId = eachquerie.id
    this.isQuickReply = false;
   //  if(this.elementRef && !this.elementRef.nativeElement.disabled) {
   //    this.elementRef.nativeElement.focus();
   //  }
  }
}
// clicked on dotted line
clickedOnDottedLine(indx) {
  if(this.queriesData[indx].isClickOnDottedLine) {
    this.queriesData[indx].isClickOnDottedLine = false;
  }else {
   this.queriesData[indx].isClickOnDottedLine = true;
  }
}
// querie edit button click function
querieEditClick(querieData) {
  this.singleQuerieData = querieData;
  this.patientQuerieForm.patchValue({
   subject: this.singleQuerieData.title,
   querie: this.singleQuerieData.content
 })
 }
 // updatePatientQuerie
 updatePatientQuerie() {
   this.quriesService.editQuerieService(this.singleQuerieData.id, this.patientQuerieForm.value.subject,
     this.patientQuerieForm.value.querie).subscribe(
     (updatedResponse: any) => {
       console.log(updatedResponse);
       this.isQuerieEdit = false;
       this.isAlertPopup = true;
       this.alertMessage = updatedResponse.description;
       this.queriesData.forEach(query => {
         if(this.singleQuerieData.id==query.id)
          {
            console.log(query);
            query.content=this.patientQuerieForm.value.querie;
            query.title=this.patientQuerieForm.value.subject;
          }
       });
     }, (err) => {
 
     }, () => {
       this.isStartLoader = false;
     });
 }
selectedQuery="";
 getQuerieTemplates(eachquerie) {
   this.showQueries(eachquerie);
   this.selectedQuery=eachquerie;
 this.isStartLoader = true;
 let navItem: any;
 for (navItem of this.queriesData) {
   if (navItem.activeclass === this.activeClassName) {
          navItem.activeclass = '';
   }
   else if(navItem.id===eachquerie.id)
   {
           navItem.activeclass = this.activeClassName;
   }
 }
 eachquerie.activeclass = this.activeClassName;
 this.isQuickReply = true;
  this.getDetailsEachQuerie(eachquerie.id);
 this.quriesService.getQuerieReplyTemplates().subscribe(
   (queriesResponse: any) => {
     console.log(queriesResponse);
     this.querieTemplatesData = queriesResponse.description;
   }, (err) => {

   }, () => {
      this.querieTemplatesData.forEach(template=>{
            template.isShown=true;

          })
     this.isStartLoader = false;
     this.showTemplates(0);

   });
}

querytemplate:any;

quickReplyEdit(template){
  // console.log(content); 
  // console.log(id);
  this.querytemplate=template;
  this.editContent=template.content;
  this.editId=template.id;
  this.isEditClick=true;
   this.querieTemplatesData.forEach(temp=>{
             if(temp.id==template.id)
                  template.isShown=false;
          })
  // if(this.editId == template.id){
  //    this.isEditClick=true;
  //  }else{
  //    this.isEditClick=false;
  //  }
} 

cancelQuickReply(){
   console.log(this.querytemplate.id);
   this.querieTemplatesData.forEach(temp=>{
             if(temp.id==this.querytemplate.id)
                  this.querytemplate.isShown=true;
          })
}

quickReplySave(content,editId){
  //console.log(editId);
 
 this.isStartLoader = true;
  this.quriesService.quickReplyUpdateService(content,editId).subscribe(res=>{
     console.log("success");
     this.isEditClick=false;

     this.querieTemplatesData.forEach(template => {
       console.log(template);
       if(template.id==editId)
        {
          template.content=content;
          template.isShown=true;
        }
     });
      // this.quriesService.getQuerieReplyTemplates().subscribe(
      //      (queriesResponse: any) => {
      //        this.querieTemplatesData = queriesResponse.description;
      //         this.showTemplates(0);
      //      },
      //      err=>{},()=>{
      //        this.querieTemplatesData.forEach(template=>{
      //          template.isShown=true;
      //        })
      //      });
      this.isStartLoader = false;
  });

}



// upload publish comment image
uploadImage() {
  
  const fileBrowser = this.fileQuerieInput.nativeElement;
  // if (fileBrowser.files && fileBrowser.files[0]) {
    if(fileBrowser.files[0].size/1024/1024 > 9) {
      this.imageUploadAlert = true;
      this.imageerrorAlert = false;
      // this.imageSrc = "";
      this.fileQuerieInput.nativeElement.value = '';
      return false;
    }
    this.isStartLoader = true;
    this.imageerrorAlert = false;
    this.imageUploadAlert = false;
   // console.log(fileBrowser.files[0]);
    const fd = new FormData();
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    for(var key=0;key<fileBrowser.files.length;key++)
     {
        if(key==0)
          fd.append('file', fileBrowser.files[key]);
       else{
         fd.append('file'+key, fileBrowser.files[key]);
       }
        
     }
    //fd.append('file', fileBrowser.files[0]);
    fd.append('userid', currentuser.id);
    fd.append('username', currentuser.username);
    fd.append('password', currentuser.pwd);
    fd.append('encode', 'true');
    fd.append('auth_key', currentuser.auth);
    
    this.authService.uploadImageService(fd).subscribe(res => {
      // do stuff w/my uploaded file
    //  console.log(res.description[0].url);
      if(res.description==undefined)
      {
           // console.log("error");
            this.imageUploadAlert = false;
            this.imageerrorAlert=true;
      }else{
        res.description.forEach(image=>{
          this.imageSrc.push(image.url);
        })
       // this.imageSrc.push(res.description[0].url);
        this.isStartLoader = false;          
      }
    },(err) => {
      this.isStartLoader = false;
     }, () => {
      this.fileQuerieInput.nativeElement.value = '';
      this.isStartLoader = false;
    });
}
   removeImage(index){
      this.imageSrc.splice(index,1);
      this.imageerrorAlert=false;
      this.imageUploadAlert = false;
  }
//  deleteQuer
eachQueries:any=[];
deleteQuery(eachQuerie){
    this.eachQueries=eachQuerie;
    console.log(this.eachQueries);
    this.isDeleteAlertPopup=true;
    this.alertText="Are You Want To Delete The Query?";
 }
// delete querie template
deleteid:string='';
isDeleteTemplate:boolean=false;
alertText="";
deleteQuerieTemplate(tId) {
   this.isDeleteAlertPopup=true;
   this.alertText="Are You Want To Delete The Template?";

  this.deleteid=tId;
  this.isDeleteTemplate=true;
}

deleteAndIonizeAlertPopup(){
    if(this.isDeleteTemplate  == true){
          this.isStartLoader = true;
          this.quriesService.deleteQuerieTemplateData(this.deleteid).subscribe(
         (qResponse: any) => {
           console.log(qResponse);
           this.isDeleteAlertPopup=false;
           this.isDeleteTemplate  =false;
           this.isStartLoader = false;
           this.getQuerieTemplates(this.selectedQuery);
         });
   }
   else if(this.isIonizeQuery== true){
    //  console.log(this.eachquerie);
      this.isDeleteAlertPopup=false;
       var title="";
        var content="";
        this.isStartLoader=true;
        this.eachquerie.isClickOnDottedLine=false;
        this.createTheBlogForm.patchValue({
          status:4
        });
        this.quriesService.getDetailQuerie(this.eachquerie.id).subscribe(
          (queriesResponse: any) => {
                  console.log(queriesResponse.posts);
                  title=queriesResponse.posts[0].title;
                  for(var i=0;i<queriesResponse.posts.length;i++)
                    {
                          content=content+"<p>"+queriesResponse.posts[i].content +"</p><br>";
                    }
                  console.log(content);
                  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
                  console.log(currentuser);
                  this.createTheBlogForm.patchValue({
                      title: title,
                      content:content,
                      type:currentuser.publishid,
                      image:'',
                      topicId:'',
                      createdDate:new Date(),
                      createdTime:new Date()
                  })
                    
                  this.publishService.createTheBlogService(this.createTheBlogForm.value,'')
                  .subscribe(
                        (updateblogResponse: any) => {
                          console.log(updateblogResponse);
                          this.isStartLoader=false;
                          this.isAlertPopup = true;
                          this.alertMessage = "Your ionize Request is Taken."
                          this.isIonizeQuery=false;
                          //this.clearTheForm();
                        }, (err) => {
                                console.log(err);
                        }, () => {
                        
                    });
                  
                }, (err) => {

                }, () => {
                    
                }); 
   }
   else{
      //  console.log(this.eachQueries);
        this.isStartLoader = true;
        this.quriesService.deleteQuery(this.eachQueries.id).subscribe(res => {
            this.queriesData.forEach((querie,key) => {
              console.log(key);
                if(querie.id===this.eachQueries.id)
                  {
                    this.queriesData.splice(key,1);
                    if(this.queriesData.length!=0 && this.eachQueries.activeclass==="active" && this.queriesData.length===key)
                      {
                            this.queriesData[key-1].activeclass="active";
                            this.showQueries(this.queriesData[key-1]);
                      }
                    else if(this.queriesData.length!=0 && this.eachQueries.activeclass==="active")
                      {
                            //this.queriesData.splice(key,1);
                            this.queriesData[key].activeclass="active";
                            this.showQueries(this.queriesData[key]);
                      }
                  }
              });
              this.isAlertPopup=true;
              this.alertMessage = "Question Deleted Successfully.";
              },(err) => {
                this.isStartLoader = false;
                this.isDeleteAlertPopup=false;
              }, () => {
                this.isStartLoader = false;
                this.isDeleteAlertPopup=false;
         });
       }
          
   }
      makeTheQuestionAsPopular(eachQuerie){
        this.isStartLoader=true;
        this.quriesService.makeTheQuestionASPoular(eachQuerie.id).subscribe(res => {
                 this.userDispalyData.featured=1;
                  },(err) => {
                    this.isStartLoader = false;
                  }, () => {
                    this.isStartLoader = false;
        })
      }
       makeTheQuestionAsPopularUnPopular(eachQuerie){
        this.isStartLoader=true;
        this.quriesService.makeTheQuestionASPoularUnPopular(eachQuerie.id).subscribe(res => {
                 this.userDispalyData.featured=0;
                  },(err) => {
                    this.isStartLoader = false;
                  }, () => {
                    this.isStartLoader = false;
        })
      }
      ionizeTheQuery(eachquerie){
     //   console.log(eachquerie);
        this.isDeleteAlertPopup=true;
        this.alertText="Are You Want To Ionize The Query?";
        this.isIonizeQuery=true;
        this.eachquerie=eachquerie;
        // var title="";
        // var content="";
        // this.isStartLoader=true;
        // eachquerie.isClickOnDottedLine=false;
        // this.createTheBlogForm.patchValue({
        //   status:4
        // });
        // this.quriesService.getDetailQuerie(eachquerie.id).subscribe(
        //   (queriesResponse: any) => {
        //           console.log(queriesResponse.posts);
        //           title=queriesResponse.posts[0].title;
        //           for(var i=0;i<queriesResponse.posts.length;i++)
        //             {
        //                   content=content+"<p>"+queriesResponse.posts[i].content +"</p><br>";
        //             }
        //           console.log(content);
        //           const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
        //           console.log(currentuser);
        //           this.createTheBlogForm.patchValue({
        //               title: title,
        //               content:content,
        //               type:currentuser.publishid,
        //               image:'',
        //               topicId:'',
        //               createdDate:new Date(),
        //               createdTime:new Date()
        //           })
                    
        //           this.publishService.createTheBlogService(this.createTheBlogForm.value,'')
        //           .subscribe(
        //                 (updateblogResponse: any) => {
        //                   console.log(updateblogResponse);
        //                   this.isStartLoader=false;
        //                   this.isAlertPopup = true;
        //                   this.alertMessage = "Your ionize Request is Taken."
        //                   //this.clearTheForm();
        //                 }, (err) => {
        //                         console.log(err);
        //                 }, () => {
                        
        //             });
                  
        //         }, (err) => {

        //         }, () => {
                    
        //         }); 
            }
              
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullTextSearch',
  pure: false
})
export class QuerySearchPipe implements PipeTransform {

  constructor() { }
  public transform(value, keys: string, term: string) {
    // console.log(term);
    if (!term) return value;
    return (value || []).filter((item) => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])));

  }
}
