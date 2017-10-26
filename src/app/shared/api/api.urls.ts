import { IonServer } from '../globals/global';

export class API {

  public static removeWhiteSpaces(urlString) {
    return urlString.replace(/^\s+|\s+$/gm, '');
  }
// Login Api url
  public static LOGIN_API() {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}?option=com_api&app=users&resource=login&format=raw`);
  }
  // Forgotpassword Api url
  public static FORGOT_PASSWORD_API(emailId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=user&action=get&resource=reset&
    email=${emailId}`);
  }
 // getting blogs api url
  public static GET_BLOGS(authkey, category, limitStart) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=latest&key=
    ${authkey}&user_id=${category}&limitstart=${limitStart}&limit=10`);
  }
  // getting all queries api url
  public static GET_ALL_QUERIES(username) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&resource=posts&
    username=${username}&limit=10`);
  }
  // getting unanswered queries api url.
  public static GET_UNANSWERED_QUERIES(userId, username) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&resource=posts&
    username=${username}&limit=10&status=0`);
  }
  // getting answered queries api url.
  public static GET_ANSWERED_QUERIES(userId, username) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&resource=posts&
    username=${username}&limit=10&status=1`);
  }
   // add answer to querie api call
   public static ADD_ANSWER_TO_QUERIE(qId, replyData, uId, username, pwd) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=post&resource=reply&
    encode=true&private=0&pwd=${pwd}&question_id=${qId}&reply=${replyData}&user_id=${uId}&username=${username}`);
  }
   // getting detail queries api url.
   public static GET_DETAILS_QUERIE(id) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&resource=posts&
    id=${id}`);
  }
  // getting detail queries api url.
  public static GET_QUERIE_TEMPLATES(id) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&resource=templateslist&
    userid=${id}`);
  }
   // add querie template api url.
   public static ADD_QUERIE_TEMPLATE(id, title) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=post&resource=addtemplate&
    userid=${id}&title=${title}&content=${title}`);
  }
   // delete queries api url.
   public static DELETE_QUERIE_TEMPLATE(id) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=put&resource=edittemplate&
    id=${id}&type=delete`);
  }
  // get dashboard statistics api url
  public static GET_DASHBOARD_STATISTICS(userId) {
    console.log(userId);
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=ionizeddraftreport&
    userid=${userId}&resource=posts&module=ionize`);
  }
  // get dashboard feeds api url
  public static GET_DASHBOARD_FEEDS(userId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=get&module=feeds&resource=getfeeds&
    userid=${userId}`);
  }
  // Get notifications api
  public static GET_DASHBOARD_NOTIFICATIONS(userId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=latest&
    user_id=${userId}&key=e69071fc2d60078968041ecfaefe2675fafc8fd9&promos=2&status=1`);
  }
  // get promotions api url
  public static GET_PROMOTIONS(userId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=category&key=
    e69071fc2d60078968041ecfaefe2675fafc8fd9&parentid=87`);
  }
  // get promotions ionized blogs api url
  public static GET_iONIZED_PROMOTIONS(userId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=latest&user_id=
    ${userId}&key=e69071fc2d60078968041ecfaefe2675fafc8fd9&promos=1&status=0`);
  }
   // get ionized blog full view api url
  public static GET_BLOG_FULL_VIEW(userId) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_api&format=raw&app=easyblog&resource=blog&id=6565`);
  }
   // get VISITS api url
   public static GET_VISITS_LIST(username, pwd) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&
    format=raw&task=get_adm_bookings&adm=1&list_type=daily&usr=${username}&pwd=${pwd}&encode=true&sd=2017-10-16`);
  }
   // add VISIT api url
   public static ADD_VISIT(visitObj) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&
    format=raw&task=insertBooking&res_id=${visitObj.resId}&ce_id=${visitObj.ceId}&name=${visitObj.name}&email=
    ${visitObj.email}&phone=${visitObj.phone}&startdate=${visitObj.startdate}&starttime=${visitObj.starttime}&enddate=
    ${visitObj.enddate}&endtime=${visitObj.endtime}&booked_seats=1&comment=&coupon_used=&credit_used=0&booking_deposit=
    ${visitObj.bookingDeposit}&booking_total=${visitObj.bookingTotal}&request_status=new&fa=No&user_id=${visitObj.userId}`);
  }
   // delete VISITS api url
   public static DELETE_VISIT(username, pwd, id) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&
    format=raw &task=delete_visits&usr=${username}&pwd=${pwd}&encode=true&id=${id}`);
  }
   // get Leads api url
   public static GET_ALL_LEADS(userId, username, pwd) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/get/contacts/contacts?user_id=${userId}&
    username=${username}&pwd=${pwd}&encode=true&source=leads`);
  }
   // add Leads api url
   public static ADD_LEAD(leadObj) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/post/contacts/contacts?type=${leadObj.ptype}&
    age=${leadObj.age}&firstname=${leadObj.fname}&surname=${leadObj.uname}&mobile=${leadObj.mobile}&
    email=${leadObj.email}&dob=${leadObj.dob}&sex=${leadObj.sex}&purpose=${leadObj.purpose}&image=${leadObj.image}&
    area=${leadObj.area}&city=${leadObj.city}&pincode=${leadObj.pin}&remarks=${leadObj.remarks}&
    userid=${leadObj.uid}&contactTags=${leadObj.ctags}&tagflag=1&misc=visit`);
  }
   // get Leads by filter api url
   public static GET_LEADS_BY_FILTER(userId, username, pwd) {
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/get/contacts/contacts?user_id=${userId}&
    username=${username}&pwd=${pwd}&encode=true&source=leads,query&withemail=1&withphone=1&age=20-30&gender=female`);
  }

  
  
  //analytics api's url
  public static GET_ANALYTICS(){
    return  this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request/get/k2/items/59`);
  }
  //vists day wise accepted(line chart) api url.
  public static GET_DAY_LINE(datestr, username, pwd){
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_reports&fileout=yes&format=raw&task=get_adm_bookings&list_type=day&sd=`+datestr+`&usr=`+username+`&pwd=`+pwd+`&encode=true`);
  }
  //vists  day wise accepted and cancelled(bar chart) api url.
  public static GET_DAY_BAR(datestr,username, pwd){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_reports&fileout=yes&format=raw&task=get_adm_bookings&list_type=day_visited_count&sd=`+datestr+`&usr=`+username+`&pwd=`+pwd+`&encode=true`);
  }

  //vists month wise accepted(line chart) api url.
  public static GET_MONTH_LINE(selectedYear,selectedMonth,username, pwd){
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_reports&fileout=yes&format=raw&task=get_adm_bookings&list_type=byweek&status=accepted&sd=`+selectedYear+`-`+selectedMonth+`&usr=`+username+`&pwd=`+pwd+`&encode=true`);
  }
  //vists  month wise accepted and cancelled(bar chart) api url.
  public static GET_MONTH_BAR(selectedYear,selectedMonth,username, pwd){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_reports&fileout=yes&format=raw&task=get_adm_bookings&list_type=bytotal&sd=`+selectedYear+`-`+selectedMonth+`&usr=`+username+`&pwd=`+pwd+`&encode=true`);
  }

  //vists year wise accepted(line chart) api url.
  public static GET_YEAR_LINE(selectedYear,username, pwd){
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_reports&fileout=yes&format=raw&task=get_adm_bookings&list_type=yearly&sd=`+selectedYear+`&usr=`+username+`&pwd=`+pwd+`&encode=true`);
  }
  //vists  year wise accepted and cancelled(bar chart) api url.
  public static GET_YEAR_BAR(selectedYear,username, pwd){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_reports&fileout=yes&format=raw&task=get_adm_bookings&list_type=year_visited_count&sd=`+selectedYear+`&usr=`+username+`&pwd=`+pwd+`&encode=true`);
  }
  //vists doctor wise revenue api url.
  public static GET_REVENUE(teamid){
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&format=json&task=get_doctors_total_amount&user_id=`+teamid);
  }
  //vists doctor wise api rl.
  public static GET_DCOTOR_VISITS_LIST(teamid){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php?option=com_rsappt_pro3&controller=json_x&fileout=yes&format=json&task=get_doctors_visit_count&user_id=`+teamid);
  }

  //category wise queries api url.
  public static GET_QUERIES_CATEGORY(teamid){
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&resource=monthlyquerylist&userid=`+teamid);
  }
  //month wise(last one year) queries api url.
  public static GET_QUERIES_LAST_YEAR(teamid){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?module=easydiscuss&action=get&resource=monthlyquerylist&userid=`+teamid+`&type=yearly`);
  }

  //month wise published blogs api url.
  public static GET_BLOGS_LIST_CATEGORY(){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=blogchart&module=ionize&resource=posts&catid=65`);
  }

  //month wise published blogs table api url.
  public static GET_BLOGS_LIST(){
      return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=blogcounts&module=ionize&resource=posts&userid=180`);
  }

  //email news letter api url.
  public static GET_EMAIL_NEWS_LETTER(){
    return this.removeWhiteSpaces(`${IonServer.ION_SERVER}/index.php/request?action=blogchart&module=ionize&resource=posts&userid=180&type=newsletters`);
  }


}
