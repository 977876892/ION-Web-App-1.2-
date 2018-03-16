import { IonServer } from '../globals/global';

export class API {

  public static removeWhiteSpaces(urlString) {
    return urlString.replace(/^\s+|\s+$/gm, '');
  }
// Login Api url
  public static LOGIN_API() {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}?option=com_api&app=users&resource=login&format=raw`);
  }
  // terms and conditions Api url
  public static TERM_CONDITIONS() {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/request/get/k2/items?id=56`);
  }
  public static PRIVACY_POLICY() {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/request/get/k2/items?id=61`);
  }
  // Forgotpassword Api url
  public static FORGOT_PASSWORD_API(emailId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=user&action=get&resource=reset&
    email=${emailId}`);
  }
   public static GET_COMMON_DETAILS(teamid) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=user&action=get&resource=profiledata&userid=${teamid}`);
  }
  // upload image api
  public static UPLOAD_IMAGE() {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=post&module=user&resource=upload`);
  }
  
 // getting blogs api url
  public static GET_BLOGS(authkey, category, limitStart) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=latest&key=
    ${authkey}&user_id=${category}&limitstart=${limitStart}&limit=10`);
  }
  public static GET_BLOG_TAGS(auth){
     return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&app=easyblog&resource=tags&format=raw&key=${auth}&limitstart=0&title=""`);
  }
  //get Categorirs
  public static GET_CATEGORIES(teamid){
     return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=clienttags&module=ionplanner&resource=planner&userid=${teamid}`);
  }
  public static GET_BLOG_TYPES(key,publishid){
     return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=category&key=${key}&parentid=${publishid}`);
  }
  public static CREATE_TRENDING_TOPIC(topic,date)
  { 
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=post&module=ionplanner&resource=planner&created_by=${topic.created_by}&title=${topic.title}&start_date=${date}&color=red&description=cardiology&end_date=${date}&tags=${topic.tag}`);
  }

  // congratulate

  public static CONGRATULATE(feedid,userid){
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=post&module=feeds&resource=feedaction&
      userid=${userid}&feed_id=${feedid}&feedaction=Congratulate`);
  }
     public static CONGRATULATED(feedid,userid){
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=post&module=feeds&resource=feedaction&
      userid=${userid}&feed_id=${feedid}&feedaction=Congratulated`);
  }
  // update replay queries api url
  public static UPDATE_QUICK_REPLY(content,editId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=put&resource=edittemplate&id=${editId}&content=${content}&type=html`);
  }
  // getting all queries api url
  public static GET_ALL_QUERIES(userId,username,startFrom,limit) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&resource=posts&
    username=${username}&&limitstart=${startFrom}&limit=${limit}&featured=1&publish=1`);
  }
  // getting unanswered queries api url.
  public static GET_UNANSWERED_QUERIES(userId, username,startFrom,limit) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&resource=posts&
    username=${username}&limitstart=${startFrom}&limit=${limit}&status=0&publish=1`);
  }
  // getting answered queries api url.
  public static GET_ANSWERED_QUERIES(userId, username,startFrom,limit) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&resource=posts&
    username=${username}&limitstart=${startFrom}&limit=${limit}&publish=1&status=1`);
  }
   // add answer to querie api call
   public static ADD_ANSWER_TO_QUERIE(qId, replyData, uId, username, pwd,publishOrNotValue,attachments) {
     if(attachments=="")
      {
        return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=post&resource=reply&
          encode=true&private=${publishOrNotValue}&pwd=${pwd}&question_id=${qId}&reply=${replyData}&user_id=${uId}&username=${username}&type=html`);
      }
      else{
        return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=post&resource=reply&
          encode=true&private=${publishOrNotValue}&pwd=${pwd}&question_id=${qId}&reply=${replyData}&user_id=${uId}&username=${username}${attachments}&type=html`);
      }
     }
   // getting detail queries api url.
   public static GET_DETAILS_QUERIE(id,userId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&resource=posts&
    id=${id}&user_id=${userId}`);
  }
  // getting detail queries api url.
  public static GET_QUERIE_TEMPLATES(id) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&resource=templateslist&
    userid=${id}`);
  }
   // add querie template api url.
   public static ADD_QUERIE_TEMPLATE(id, title) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=post&resource=addtemplate&
    userid=${id}&title=${title}&content=${title}&type=html`);
  }
   // delete queries api url.
   public static DELETE_QUERIE_TEMPLATE(id) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=put&resource=edittemplate&
    id=${id}&type=delete`);
  }
  public static DELETE_QUERY(username,pwd,questionid){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=delete&resource=querydelete&username=${username}&pwd=${pwd}&id=${questionid}&encode=true`);
  }
  public static MAKE_AS_POPULAR(username,pwd,questionid){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=put&resource=update&featured=1&id=${questionid}&username=${username}&pwd=${pwd}&encode=true`);
  }
   public static MAKE_AS_UNPOPULAR(username,pwd,questionid){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=put&resource=update&featured=0&id=${questionid}&username=${username}&pwd=${pwd}&encode=true`);
  }
  // get dashboard statistics api url
  public static GET_DASHBOARD_STATISTICS(userId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=ionizeddraftreport&
    userid=${userId}&resource=posts&module=ionize`);
  }

  // get down load categories
  public static DOWNLOAD_QUERIES(username){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&resource=posts&
    username=${username}&csv=1`);

  }
  // get categories 
  public static GET_QUERIES_CATEGORIES(id){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&
    resource=getcategories&userid=${id}`);
  }
  // transfer query
  public static TRANSER_QUERY(username,pwd,id,catid){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=put&resource=update&
    id=${id}&username=${username}&pwd=${pwd}&encode=true&category_id=${catid}`);
  }
  // edit querie
  public static UPDATE_QUERIE(qid, title, content, username, pwd) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=put&resource=update&
    id=${qid}&title=${title}&content=${content}&username=${username}&pwd=${pwd}&encode=true`);
  }

  // get dashboard feeds api url
  public static GET_DASHBOARD_FEEDS(userId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=get&module=feeds&resource=getfeeds&userid=${userId}`);
  }

  // Get notifications api
  public static GET_DASHBOARD_NOTIFICATIONS(userId,auth_key) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=latest&
    user_id=${userId}&key=${auth_key}&promos=2&status=1`);
  }
  // get promotions api url
  public static GET_PROMOTIONS(userId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&
    resource=category&parentid=87&format=nested`);
  }
  // send sms using tags
  public static SEND_SMS_USING_TAGS(tags,message,username,pwd){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/sendSmsByTags/contacts/contacts?
    sendType=server&tags=${tags}&username=${username}&pwd=${pwd}&encode=true&message=${message}`);
  }
   public static SEND_SMS_USING_NUMBERS(phoneNo,message,username,pwd){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/sendSmsByPhoneNumb/contacts/contacts?
    sendType=server&phone=${phoneNo}&username=${username}&pwd=${pwd}&encode=true&message=${message}`);
  }
  // get promotions ionized blogs api url
  public static GET_iONIZED_PROMOTIONS(userId,authkey) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=latest&user_id=
    ${userId}&key=${authkey}&promos=1&status=0`);
  }
   
   // get ionized blog full view api url
  public static GET_BLOG_FULL_VIEW(id) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=blog&id=${id}`);
  }
  // add prootion api url
  public static ADD_PROMOTION() {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=blog`);
  }
   // get VISITS api url
   public static GET_VISITS_LIST(username, pwd,date) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&
    fileout=yes&format=raw&task=get_adm_bookings&adm=1&list_type=upcoming&usr=${username}&pwd=${pwd}&encode=true&sd=${date}&publish=1`);
  }
   // add VISIT api url
   public static ADD_VISIT(visitObj, udfObj) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&
    format=raw&task=insertBooking&res_id=${visitObj.res_id}&name=${visitObj.name}&email=
    ${visitObj.email}&phone=${visitObj.phone}&startdate=${visitObj.startdate}&starttime=${visitObj.starttime}&enddate=
    ${visitObj.enddate}&endtime=${visitObj.endtime}&booked_seats=1&comment=${visitObj.comments}&coupon_used=&credit_used=0&booking_deposit=
    ${visitObj.booking_deposit}&booking_total=${visitObj.booking_total}&request_status=${visitObj.request_status}&
    fa=No&user_id=${visitObj.user_id}&
    image=${visitObj.image}&category=${visitObj.category}&udf_values_info=${udfObj}&tags=${visitObj.tags}`);
  }
  //get visit Details 
  public static GET_VISITS_DETAIL_VIEW(username, pwd,id){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&format=raw&task=get_booking_detail&usr=${username}&pwd=${pwd}&encode=true&req_id=${id}&adm=1`);
}
  // update visits api call
  public static UPDATE_VISIT(username, pwd,visitObj,strUDFs) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&format=raw&task=adm_update_booking&req_id=${visitObj.req_id}&res_id=${visitObj.res_id}&startdate=${visitObj.startdate}&starttime=${visitObj.starttime}&enddate=${visitObj.enddate}&endtime=${visitObj.endtime}&booked_seats=1&coupon_used=&credit_used=0&booking_deposit=${visitObj.booking_deposit}&booking_total=${visitObj.booking_total}&request_status=${visitObj.request_status}&fa=No&user_id=${visitObj.user_id}&category=${visitObj.category}&usr=${username}&pwd=${pwd}&encode=true&payment_status=pending&name=${visitObj.name}&phone=${visitObj.phone}&email=${visitObj.email}&comment=${visitObj.comments}&ce_id=${visitObj.ce_id}&photo=${visitObj.image}&udf_values_info=${strUDFs}`);
  }

   // delete VISITS api url
   public static DELETE_VISIT(username, pwd, id) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&
    format=raw &task=delete_visits&usr=${username}&pwd=${pwd}&encode=true&id=${id}`);
  }

  //download visits
  public static GET_DOWNLOAD_VISITS(id,username,pwd){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&format=raw&task=get_adm_bookings&list_type=total&usr=${username}&pwd=${pwd}&adm=1&encode=true&csv=1`);
  }
   // get categeories api url
   public static GET_CATEGEORIES_LIST(username, pwd, catId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&
    format=raw&task=get_categories&usr=${username}&pwd=${pwd}&encode=true&cat_id=${catId}&sc=1`);
  }
   // get doctors api url
   public static GET_DOCTORS_LIST(username, pwd, catId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&
    format=raw&task=get_adm_resources&usr=${username}&pwd=${pwd}&cat_id=${catId}&adm=1&encode=true`);
  }
  // get doctors time slots api url 
  public static GET_DOCTORS_TIME_SLOTS_LIST(resId, tsData, username, pwd) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&
    format=raw&task=get_timeslots&admin=Yes&res_id=${resId}&ts_date=${tsData}&usr=${username}&pwd=${pwd}&
    adm=1&encode=true`);
  }
   public static GET_APPOINTMENTS_BETWEEN_DATES(resId, startDate,days, username, pwd) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&format=raw&task=get_adm_bookings&list_type=between&sd=${startDate}&offset=${days}&usr=${username}&pwd=${pwd}&res_id=${resId}&adm=1&encode=true`);
  }
   public static DELETE_APPOINTMENT(username, pwd,id) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&format=raw&task=delete_visits&usr=${username}&pwd=${pwd}&encode=true&id=${id}`);
  }

  
   //get Leads api url
   public static GET_ALL_LEADS(teamId, username, pwd) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/get/contacts/contacts?user_id=${teamId}&
    username=${username}&pwd=${pwd}&encode=true`);
  }

   // add Leads api url
   public static ADD_LEAD(leadObj) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/post/contacts/contacts?type=${leadObj.ptype}&
    age=${leadObj.age}&firstname=${leadObj.firstname}&surname=${leadObj.surname}&mobile=${leadObj.phone}&
    email=${leadObj.email}&dob=${leadObj.dob}&sex=${leadObj.sex}&purpose=${leadObj.purpose}&image=${leadObj.image}&
    area=${leadObj.area}&city=${leadObj.city}&pincode=&remarks=${leadObj.remarks}&
    userid=${leadObj.uid}&contactTags=${leadObj.ctags}&tagflag=1&misc=Lead`);
  }
  // update lead api url
  public static UPDATE_LEAD(leadObj,username,password){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/put/contacts/contacts?id=${leadObj.id}&
    type=${leadObj.ptype}&age=${leadObj.age}&firstname=${leadObj.firstname}&surname=${leadObj.surname}&
    mobile=${leadObj.phone}&email=${leadObj.email}&dob=${leadObj.dob}$&sex=${leadObj.sex}&purpose=&image=${leadObj.image}&
    area=${leadObj.area}&city=${leadObj.city}&pincode=522413&remarks=${leadObj.remarks}&userid=${leadObj.uid}&
    contactTags=${leadObj.ctags}&tagflag=1&username=${username}&pwd=${password}&encode=true`);
  }
   // get Leads by filter api url
   public static GET_LEADS_BY_FILTER(userId, username, pwd,filterObj) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/get/contacts/contacts?user_id=${userId}&
    username=${username}&pwd=${pwd}&encode=true&source=${filterObj.source}&withemail=${filterObj.includesEmail}&
    withphone=${filterObj.includesPhone}&age=20-30&gender=${filterObj.gender}&filtertag=${filterObj.tags}&status=1`);
  }
  public static GET_ALL_LEADS_LIMIT(teamId, username, pwd,start,limit,filterObj) {
   return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/get/contacts/contacts?user_id=${teamId}&
   username=${username}&pwd=${pwd}&encode=true&limitstart=${start}&limit=${limit}&source=${filterObj.source}&withemail=${filterObj.includesEmail}&
    withphone=${filterObj.includesPhone}&age=${filterObj.age}&gender=${filterObj.gender}&filtertag=${filterObj.tags}&status=1`);
 }

  // get  lead tags
   public static GET_LEAD_TAGS(userId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/searchTags/contacts/contacts?user_id=${userId}`);
  }
  //add tags to all contacts

  public static ADD_TAGS_TO_CONTACTS(teamid,tags,contacts){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/addTags/contacts/contacts?user_id=${teamid}&tags=${tags}&contacts=${contacts}`)
  }
  //GET DOWNLOAD LEADS
  public static GET_DOWNLOAD_LEADS(id,username, pwd){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/get/contacts/contacts?user_id=${id}&username=${username}&pwd=${pwd}&encode=true&csv=1`);
  }
  //DELETE LEADS

  public static DELETE_LEADS(userId,username, pwd,ids){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/delete/contacts/contacts?userid=${userId}&username=${username}&pwd=${pwd}&id=${ids}&encode=true`)
  }
  
  // analytics api's url
  public static GET_ANALYTICS(analyticId) {
    return  this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/get/k2/items/${analyticId}`);
  }
  // vists day wise accepted(line chart) api url.
  public static GET_DAY_LINE(datestr, username, pwd) {
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_reports&
      fileout=yes&format=raw&task=get_adm_bookings&list_type=day&sd=`+datestr+`&usr=`+username+`&pwd=`+pwd+`&encode=true`);
  }
  // vists  day wise accepted and cancelled(bar chart) api url.
  public static GET_DAY_BAR(datestr,username, pwd) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_reports&
    fileout=yes&format=raw&task=get_adm_bookings&list_type=day_visited_count&sd=`+datestr+`&usr=`+username+`&pwd=`+pwd+`&
    encode=true`);
  }

  // vists month wise accepted(line chart) api url.
  public static GET_MONTH_LINE(selectedMonth,selectedYear,username, pwd) {
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_reports&
      fileout=yes&format=raw&task=get_adm_bookings&list_type=byweek&status=accepted&sd=`+selectedYear+`-`+selectedMonth+`&
      usr=${username}&pwd=${pwd}&encode=true`);
  }
  // vists  month wise accepted and cancelled(bar chart) api url.
  public static GET_MONTH_BAR(selectedYear,selectedMonth,username, pwd) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_reports&
    fileout=yes&format=raw&task=get_adm_bookings&list_type=bytotal&sd=`+selectedYear+`-`+selectedMonth+`&usr=${username}&
    pwd=${pwd}&encode=true`);
  }

  // vists year wise accepted(line chart) api url.
  public static GET_YEAR_LINE(selectedYear,username, pwd) {
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_reports&
      fileout=yes&format=raw&task=get_adm_bookings&list_type=yearly&sd=`+selectedYear+`&usr=${username}&pwd=${pwd}&
      encode=true`);
  }
  // vists  year wise accepted and cancelled(bar chart) api url.
  public static GET_YEAR_BAR(selectedYear,username, pwd) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_reports&
    fileout=yes&format=raw&task=get_adm_bookings&list_type=year_visited_count&sd=`+selectedYear+`&usr=`+username+`&
    pwd=`+pwd+`&encode=true`);
  }
  // vists doctor wise revenue api url.
  public static GET_REVENUE(teamid) {
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&
      fileout=yes&format=json&task=get_doctors_total_amount&user_id=`+teamid);
  }
  // vists doctor wise api rl.
  public static GET_DCOTOR_VISITS_LIST(teamid) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&
    fileout=yes&format=json&task=get_doctors_visit_count&user_id=`+teamid);
  }

  // category wise queries api url.
  public static GET_QUERIES_CATEGORY(teamid) {
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&
      resource=monthlyquerylist&userid=`+teamid);
  }
  // month wise(last one year) queries api url.
  public static GET_QUERIES_LAST_YEAR(teamid){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&
    resource=monthlyquerylist&userid=`+teamid+`&type=yearly`);
  }

  // month wise published blogs api url.
  public static GET_BLOGS_LIST_CATEGORY(category) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=blogchart&module=ionize&resource=posts&
    catid=${category}`);
  }

  // month wise published blogs table api url.
  public static GET_BLOGS_LIST(teamid) {
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=blogcounts&module=ionize&
      resource=posts&userid=${teamid}`);
  }

  // email news letter api url.
  public static GET_EMAIL_NEWS_LETTER(teamid) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=blogchart&module=ionize&
    resource=posts&userid=${teamid}&type=newsletters`);
  }
 // get published blogs list
 public static GET_PUBLISH_LIST(userId, status, auth_key, limitstart, limitto) {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&
  resource=latest&user_id=${userId}&key=${auth_key}&status=${status}&limitstart=${limitstart}&limit=${limitto}&publish=1`);
}
 // create new blog publish api url
 public static CREATE_NEW_BLOG() {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=blog`);
}
 // delete the blog api url
 public static DELETE_BLOG(blogid, authkey) {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=blog&
  id=${blogid}&key=${authkey}`);
}
// edit the blog api url
public static EDIT_BLOG(blogid, authkey) {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=blog&
  id=${blogid}&key=${authkey}`);
}
// blog details view api url
public static BLOG_DETAIL_VIEW(blogId, authkey) {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=blog&
  id=${blogId}&key=${authkey}`);
}
// get all blog comments
public static GET_BLOG_COMMENTS(blogId,userid) {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=fullview&module=ionplanner&resource=planner
  &type=blog&id=${blogId}&userid=${userid}`);
}
// add blog comments
public static ADD_BLOG_COMMENTS(blogId, username, pwd,images) {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?resource=planner&action=reply&module=ionplanner&
  type=blog&id=${blogId}&usr=${username}&pwd=${pwd}&imgs=${images}&encode=true`);
}
// calendar api
public static GET_PUBLISH_CALENDAR(userid) {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=get&module=ionplanner&resource=planner&
  userid=${userid}`);
}
// get calendar by month api
public static GET_PUBLISH_CALENDAR_BY_MONTH(key, category, month) {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=calendar&key=${key}&category_id=${category}&from=${month}`);
}
public static GET_BLOGS_COUNT_IN_CALENDAR(userid,fromDate){
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=blogcounts&module=ionize&resource=posts&userid=${userid}&type=month&from=${fromDate}`);
}
// trending topics all api
public static TRENDING_TOPICS_ALL(userId) {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=trendingbytags&module=ionplanner&
  resource=planner&userid=${userId}`);
}
// trending topics calendar api
public static TRENDING_TOPICS_BY_MONTH(userId, month) {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=trendingbytags&module=ionplanner&
  resource=planner&userid=${userId}&from=${month}`);
}
// add trending topics calendar api
// public static ADD_TRENDING_TOPIC(trendObj) {
//   return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=post&module=ionplanner&resource=planner&
//   created_by=${trendObj.created_by}&title=${trendObj.title}&start_date=${trendObj.start_date}&color=red&
//   description=${trendObj.description}&end_date=${trendObj.end_date}&tags=${trendObj.tag}`);
// }
public static ADD_TOPIC_TO_CALENDAR(key,topics){
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=ionize&key=${key}&topics=${topics}`);
}
public static GET_USERS_DATA(authkey) {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=users&resource=users&
  key=${authkey}`);
}
public static GET_USER_DATA(id,key) {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=users&resource=users&key=${key}&id=${id}`);
}
public static ADD_USER_PROFILE(){
  return this.removeWhiteSpaces(IonServer.ION_SERVER+"/index.php?option=com_api&app=users&resource=users&format=raw");
}
public static UPDATE_USER_PROFILE(){
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&app=users&resource=users&format=raw`);
}
// public static UPDATE_USER_PROFILE_PARAMETER(userform,key,id){
//      return this.removeWhiteSpaces()
// }

// getting all searches
public static GET_ALL_SEARCHES(userId, type) {
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/searchall/contacts/contacts?user_id=${userId}&word=${type}`);
}
public static ION_SUBSCRIPTION(userid){
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=user&action=get&resource=profiledata&userid=${userid}`);
}
public static DELETE_USER_CARD(id){
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&app=users&resource=users&format=raw&id=${id}`);
}
public static GET_MESSAGES_COUNT(teamid,tags){
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/leadcount/contacts/contacts?user_id=${teamid}&tags=${tags}`);
}

public static SEND_REVIEW_LINK(values,currentuser){
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=contacts&resource=contacts&action=review&user_id=${currentuser.id}&email=${values.patientMailId}&mobile=${values.patientMobileNumber}`);
}
public static SEND_APPOINTMENT_LINK(values,currentuser){
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=contacts&resource=contacts&action=send&user_id=${currentuser.id}&email=${values.patientMailId}&mobile=${values.patientMobileNumber}`);
}

public static BLOCK_CALENDER(currentuser,visitForm){
  return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&format=raw&task=adm_save_bookoff&usr=${currentuser.username}&pwd=${currentuser.pwd}&encode=true&res_id=${visitForm.res_id}&bo_offdate=${visitForm.block_from}&bo_offdate2=${visitForm.block_till}&bo_starttime=${visitForm.block_from_time}&bo_endtime=${visitForm.block_to_time}&bo_pub=1&bo_fullday=${visitForm.blockAllDay}&description=${visitForm.block_detail}`);
}
  public static LOGOUT() {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=get&module=user&resource=logout`);
  }
}
