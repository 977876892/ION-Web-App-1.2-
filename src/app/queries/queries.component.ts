import { Component, Output, OnInit, ElementRef, ViewChild,HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { QueriesService } from '../shared/services/queries/queries.service';
import { FormBuilder, FormControl, FormGroup,FormArray } from '@angular/forms';
import { PublishService } from '../shared/services/publish/publish.service';
import 'rxjs/Rx' ;
import { AuthserviceService } from '../shared/services/login/authservice.service';
import { IonServer } from '../shared/globals/global';
import { ErrorService } from '../shared/services/error/error.service';
@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  providers: [QueriesService, AuthserviceService,PublishService,ErrorService]
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
  imgerror="Choose Only Images.";
  imgsize="The file size can not exceed 8MB.";
  isEditClick: boolean = false
  editContent="";
  editId="";
  currentuser=localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
  loginUserGroupId=this.currentuser.userGroup;
  loginUser=this.currentuser.id;//login user id for blog credentials.
  spaceComment=IonServer.Space_Not_required;
  @ViewChild('fileQuerieInput') fileQuerieInput;
  patientQuerieForm: FormGroup = this.builder.group({
    subject: new FormControl(''),
    querie: new FormControl('')
  });
  singleQuerieData: any = {};
  // publish to web site
  publishOrNot:boolean=true;
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
    private publishService: PublishService,private errorservice:ErrorService) {
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
      this.getQueriesBasedOnUrlStatus();
        
      // this.route.params.forEach((params: Params) => {
      //   if (params.qId !== '' && params.qId !== undefined) {
      //     this.querieID = params.qId;
      //   }
      // });
    }
  }
   getQueriesBasedOnUrlStatus(){
     this.queriesData=[];
      if (this.router.url == '/queries') {
        this.queriesTab='unanswered';
        this.querieTypeText = 'unanswered';
        this.startFrom=0;
        this.getAllUnansweredQueries();
      }
      else if (this.router.url == '/queries/answered') {
        this.queriesTab='answered';
        this.querieTypeText = 'answered';
        this.startFrom=0;
        this.getAllAnsweredQueries();
      
      }
      else if (this.router.url == '/queries/popular') {
        this.queriesTab='popular';
        this.querieTypeText = 'popular';
        this.startFrom=0;
        this.getQueries();
        
      }
    }

  // Getting All queries
  showNoQueriesAvailable=false;
 getQueries() {
  this.isStartLoader = true;
  this.showNoQueriesAvailable=false;
  //this.queriesData=[];
  this.quriesService.getAllQueries(this.startFrom,this.limit).subscribe(
    (queriesResponse: any) => {
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
      var errorMessage= this.errorservice.logError(err);
      this.isStartLoader = false;
      this.isAlertPopup=true;
      this.alertMessage=errorMessage;
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
  //this.queriesData=[];
  this.isStartLoader = true;
  this.showNoQueriesAvailable=false;
  this.quriesService.getAnsweredQueries(this.startFrom,this.limit).subscribe(
    (queriesResponse: any) => {
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
      var errorMessage= this.errorservice.logError(err);
      this.isStartLoader = false;
      this.isAlertPopup=true;
      this.alertMessage=errorMessage;
    }, () => {
      this.queriesData.forEach((eachData) => {
        eachData.isClickOnDottedLine = false;
      });
       this.isStartLoader = false;
    });
}

 // Getting All unanswered queries
 getAllUnansweredQueries() {
  this.isStartLoader = true;
  this.showNoQueriesAvailable=false;
  //this.queriesData=[];
  this.quriesService.getUnAnsweredQueries(this.startFrom,this.limit).subscribe(
    (queriesResponse: any) => {
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
      var errorMessage= this.errorservice.logError(err);
      this.isStartLoader = false;
      this.isAlertPopup=true;
      this.alertMessage=errorMessage;
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
      this.eachQuerieData = queriesResponse.posts;
    }, (err) => {
      var errorMessage= this.errorservice.logError(err);
          this.isAlertPopup=true;
          this.alertMessage=errorMessage;
          this.isStartLoader=false;
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
  if(this.publishOrNot==true)
      {
        //publish to website.
        this.publishOrNotValue=0;
      }
      else{
        //don't publish to website.
        this.publishOrNotValue=1;
      }
  //return;
  replyData=replyData.trim();
  if(replyData=='')
    {
      this.isReplyEmpty=true;
    }
    else{
      this.imageerrorAlert=false;
       this.imageUploadAlert = false;
      var attachments="";
      if(this.imageSrc.length>0)
        {
          attachments="&attachments="+this.imageSrc.length;
          this.imageSrc.forEach((image,key)=>{
            attachments=attachments+"&attachment"+(key+1)+"="+image;
          })
        }
        
        this.isStartLoader = true;
        try{
        this.quriesService.addAnswerToQuerie(btoa(replyData), qId,this.publishOrNotValue,attachments).subscribe(
        (qResponse: any) => {
          this.imageSrc=[];
          this.isAlertPopup=true;
          this.alertMessage="Reply Added Successfully.";
          // this.queriesData = qResponse;
        }, (err) => {
               console.log(err);
               var errorMessage= this.errorservice.logError(err);
               this.isStartLoader=false;
               this.isAlertPopup=true;
               this.alertMessage=errorMessage;
        }, () => {
          this.isStartLoader = false;
          if (this.isAddtoQuickReply) {
            this.addQuerieTemplate(replyData);
          }
          this.isQuickReply = false;
          this.getDetailsEachQuerie(qId);
        });
        }catch(Error)
        {
           //this.answerData.value=replyData;
           //replyData=replyData;
           this.isStartLoader=false;
           this.isAlertPopup=true;
           this.alertMessage="Special Symbols are Not allowed.";
        }
      
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
  this.quriesService.addQuerieReplyTemplate(btoa(tempData)).subscribe(
    (qResponse: any) => {
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
    this.isStartLoader=true;
    this.quriesService.dowmloadQuries().subscribe(
    (qResponse: any) => {
      this.downloadFile(qResponse); 
    }, (err) => {
      var errorMessage= this.errorservice.logError(err);
         this.isAlertPopup=true;
         this.alertMessage=errorMessage;
         this.isStartLoader = false;
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
      this.categoriesList=categories.description;
     // this.downloadFile(categories); 
    }, (err) => {

    }, () => {
      this.isStartLoader = false;
    });
}
showTrasferError=false;
transferQuery(catid){
  
  if(catid!='')
    {
      this.showTrasferError=false;
        this.isStartLoader=true;
        this.quriesService.queryTrasfer(catid,this.questionId).subscribe(
          (queryTranser: any) => {
            this.isStartLoader=false;
            this.isShowTransferQuery = false;
            this.getQueriesBasedOnUrlStatus();
          }, (err) => {
            var errorMessage= this.errorservice.logError(err);
            this.isStartLoader = false;
            this.isAlertPopup=true;
            this.alertMessage=errorMessage;
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
   this.isStartLoader=true;
   this.quriesService.editQuerieService(this.singleQuerieData.id, btoa(this.patientQuerieForm.value.subject),
     btoa(this.patientQuerieForm.value.querie)).subscribe(
     (updatedResponse: any) => {
      this.isQuerieEdit = false;
      this.isStartLoader=false;
      this.alertMessage = updatedResponse.description;
        if(updatedResponse.status=="ok")
        {
            this.isAlertPopup = true;
            this.queriesData.forEach(query => {
            if(this.singleQuerieData.id==query.id)
              {
                query.content=this.patientQuerieForm.value.querie;
                query.title=this.patientQuerieForm.value.subject;
                if(this.eachQuerieData[0].id===this.singleQuerieData.id)
                  {
                      this.querieTitle=this.patientQuerieForm.value.subject;
                      this.eachQuerieData[0].content=this.patientQuerieForm.value.querie;
                  }
              }
          });
        }
     }, (err) => {
      var errorMessage= this.errorservice.logError(err);
         this.isAlertPopup=true;
         this.alertMessage=errorMessage;
         this.isStartLoader = false;
     }, () => {
       this.isStartLoader = false;
     });
 }
selectedQuery="";
showNoTemplatesAvailable=false;
 getQuerieTemplates(eachquerie) {
   this.showNoTemplatesAvailable=false;
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
     this.querieTemplatesData = queriesResponse.description;
     if(this.querieTemplatesData.length==0)
      {
        this.showNoTemplatesAvailable=true;
      }
   }, (err) => {
    var errorMessage= this.errorservice.logError(err);
    this.isAlertPopup=true;
    this.alertMessage=errorMessage;
    this.isStartLoader = false;
   }, () => {
      this.querieTemplatesData.forEach(template=>{
            template.isShown=true;

          })
     this.isStartLoader = false;
     this.showTemplates(0);

   });
}

querytemplate:any;

quickReplyEdit(index){

  //this.querytemplate=template;
 
 // this.isEditClick=true;
   this.querieTemplatesData.forEach((temp,i)=>{
          if(index==i)
          {
              this.editContent=temp.content;
              this.editId=temp.id;
              temp.isShown=false;
          }
          else{
              temp.isShown=true;
          }
                  
          })
  // if(this.editId == template.id){
  //    this.isEditClick=true;
  //  }else{
  //    this.isEditClick=false;
  //  }
} 

cancelQuickReply(index){
   this.querieTemplatesData[index].isShown=true;
  //  this.querieTemplatesData.forEach(temp=>{
  //                 temp.isShown=true;
  //         })
}

quickReplySave(content,editId){
 //content=content.replace(/&/g, "%26");
 this.isStartLoader = true;
  this.quriesService.quickReplyUpdateService(btoa(content),editId).subscribe(res=>{
     this.isEditClick=false;

     this.querieTemplatesData.forEach(template => {
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
  }, (err) => {
    var errorMessage= this.errorservice.logError(err);
    this.isAlertPopup=true;
    this.alertMessage=errorMessage;
    this.isStartLoader = false;
   }, () => {
   });

}


bigSizeImg=[];
// upload publish comment image
uploadImage() {
  this.bigSizeImg=[];
  var bigimgcontinue=false;
  const fileBrowser = this.fileQuerieInput.nativeElement;
   if (fileBrowser.files && fileBrowser.files[0]) {
    
    this.isStartLoader = true;
    this.imageerrorAlert = false;
    this.imageUploadAlert = false;
    const fd = new FormData();
    const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
    // for(var key=0;key<fileBrowser.files.length;key++)
    //  {
    //     if(key==0)
    //       fd.append('file', fileBrowser.files[key]);
    //    else{
    //      fd.append('file'+key, fileBrowser.files[key]);
    //    }
        
    //  }
      for(var key=0;key<fileBrowser.files.length;key++)
    {
       if(fileBrowser.files[key].size/1024/1024 > 9){
        //this.imageUploadAlert = false;
        this.bigSizeImg.push(fileBrowser.files[key].name + "  size can not exceed 8MB.");
        if(fileBrowser.files.length==1)
          {
            this.isStartLoader=false;
            return false;
          }
       }else{
         bigimgcontinue=true;
            if(key==0)
            fd.append('file', fileBrowser.files[key]);
            else{
              fd.append('file'+key, fileBrowser.files[key]);
            }
       }
     }
    //fd.append('file', fileBrowser.files[0]);
    fd.append('userid', currentuser.id);
    fd.append('username', currentuser.username);
    fd.append('password', currentuser.pwd);
    fd.append('encode', 'true');
    fd.append('auth_key', currentuser.auth);
   if(bigimgcontinue) {
    this.authService.uploadImageService(fd).subscribe(res => {
      // do stuff w/my uploaded file
        if(res.description==undefined)
        {
              this.isStartLoader = false;
              //this.imageUploadAlert = false;
              this.imageUploadAlert=true;
        } else{
          res.description.forEach(image=>{
            this.imageSrc.push(image.url);
          })
        // this.imageSrc.push(res.description[0].url);
          this.isStartLoader = false;          
        }
        if(res.errors.fileerror!==undefined)
            {
              this.isStartLoader = false;
              this.imageUploadAlert = false;
              this.imageerrorAlert=true;
            }
    },(err) => {
      var errorMessage= this.errorservice.logError(err);
      this.isStartLoader = false;
      this.isAlertPopup=true;
      this.alertMessage=errorMessage;
     }, () => {
      this.fileQuerieInput.nativeElement.value = '';
      this.isStartLoader = false;
    });
  }else{this.isStartLoader = false;}
  }
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
   this.isDeleteAlertPopup=false;
    if(this.isDeleteTemplate  == true){
          this.isStartLoader = true;
          this.quriesService.deleteQuerieTemplateData(this.deleteid).subscribe(
         (qResponse: any) => {
           this.isDeleteTemplate  =false;
           this.isStartLoader = false;
           this.getQuerieTemplates(this.selectedQuery);
         }, (err) => {
          var errorMessage= this.errorservice.logError(err);
          this.isAlertPopup=true;
          this.alertMessage=errorMessage;
          this.isStartLoader=false;
          this.isIonizeQuery=false;
          this.isDeleteAlertPopup=false;
     }, () => {

     });
   }
   else if(this.isIonizeQuery== true){
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
                  title=queriesResponse.posts[0].title;
                  const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
                  for(var i=0;i<queriesResponse.posts.length;i++)
                    {
                          if(queriesResponse.posts[i].poster_name=="You"||queriesResponse.posts[i].poster_name=="you")
                            {
                                  var reply="<p>"+queriesResponse.posts[i].content+"</p>";
                                  var authorandtime="<b>"+currentuser.username+"&nbsp; &nbsp; &nbsp;"+queriesResponse.posts[i].created+"</b><br>";
                                  if(queriesResponse.posts[i].attachments.length>0)
                                    {
                                      queriesResponse.posts[i].attachments.forEach((attachment,index)=>{
                                        reply=reply+"<img src='"+attachment.title+"'>"
                                      })
                                      content=content+authorandtime+reply+"<br>";
                                    }
                                    else{
                                        content=content+authorandtime+reply+"<br>";
                                    }
                            } 
                            else{
                                  var reply="<p>"+queriesResponse.posts[i].content+"</p>";
                                  var authorandtime="<b>"+queriesResponse.posts[i].poster_name+"&nbsp; &nbsp; &nbsp;"+queriesResponse.posts[i].created+"</b><br>";
                                  if(queriesResponse.posts[i].attachments.length>0)
                                    {
                                        queriesResponse.posts[i].attachments.forEach(attachment=>{
                                          reply=reply+"<img src='"+attachment.title+"'>"
                                        })
                                        content=content+authorandtime + reply;
                                    }
                                    else{
                                        content=content+authorandtime + reply;
                                    }        
                            }                   
                    }
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
                  var errorMessage= this.errorservice.logError(err);
                     this.isAlertPopup=true;
                     this.alertMessage=errorMessage;
                     this.isStartLoader=false;
                     this.isIonizeQuery=false;
                }, () => {
                    
                }); 
   }
   else{
        this.isStartLoader = true;
        this.quriesService.deleteQuery(this.eachQueries.id).subscribe(res => {
            this.queriesData.forEach((querie,key) => {
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
                var errorMessage= this.errorservice.logError(err);
                this.isStartLoader = false;
                this.isDeleteAlertPopup=false;
                this.isAlertPopup=true;
                this.alertMessage=errorMessage;
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
                    var errorMessage= this.errorservice.logError(err);
                    this.isStartLoader = false;
                    this.isAlertPopup=true;
                    this.alertMessage=errorMessage;
                  }, () => {
                    this.isStartLoader = false;
        })
      }
       makeTheQuestionAsPopularUnPopular(eachQuerie){
        this.isStartLoader=true;
        this.quriesService.makeTheQuestionASPoularUnPopular(eachQuerie.id).subscribe(res => {
                 this.userDispalyData.featured=0;
                  },(err) => {
                    var errorMessage= this.errorservice.logError(err);
                    this.isStartLoader = false;
                    this.isAlertPopup=true;
                    this.alertMessage=errorMessage;
                  }, () => {
                    this.isStartLoader = false;
        })
      }
      omit_special_char(event) {
                var k;  
                k = event.charCode; // k = event.keyCode;  (Both can be used)   
                return(k!=60 &&k!=62);
        }

      ionizeTheQuery(eachquerie){
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
        //           title=queriesResponse.posts[0].title;
        //           for(var i=0;i<queriesResponse.posts.length;i++)
        //             {
        //                   content=content+"<p>"+queriesResponse.posts[i].content +"</p><br>";
        //             }
        //           const currentuser = localStorage ? JSON.parse(localStorage.getItem('user')) : 0;
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
       windowBottom:number;
           @HostListener("window:scroll", [])
            onWindowScroll()  {
              if(!this.isDeleteAlertPopup ||!this.isAlertPopup)
                this.windowBottom= window.pageYOffset;
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

    if (!term) return value;
    return (value || []).filter((item) => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(this.escapeRegExp(term.toString().replace(/\bxx\b/g, "").replace(/xx/g, term)), 'g').test(item[key])));

  }
  escapeRegExp(str) {
    return str.replace(/[\[\]\/{}()*+?.\\^$|-]/g, "\\$&");
  }
}
