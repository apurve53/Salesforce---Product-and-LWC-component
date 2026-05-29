List<Case> allCase = [SELECT Id, Subject, Status, CreatedDate FROM Case];
System.debug('All Cases are : ' + JSON.serialize(allCase));

Case c = new Case(
    Subject = 'Payment issue',
    Status = 'New'
);

insert c;

List<Case> allCase1 = [SELECT Id, Subject, Status FROM Case];
System.debug('All Cases after Insert are : ' + JSON.serialize(allCase1));

Datetime dt = System.now().addMinutes(1);
String cron = dt.second() + ' ' + dt.minute() + ' ' + dt.hour() + ' ' + dt.day() + ' ' + dt.month() + ' ? ' + dt.year();

System.schedule( 'Run Batch Soon', cron, new CaseReminderScheduler() );

// 1. Fetch and debug Scheduled Jobs from CronTrigger
List<CronTrigger> scheduledJobs = [ SELECT Id, CronJobDetail.Id, CronJobDetail.Name, CronJobDetail.JobType, State, NextFireTime FROM CronTrigger ORDER BY CreatedDate ASC];

System.debug('--- SCHEDULED JOBS START ---');
for (CronTrigger job : scheduledJobs) {
    System.debug('Job Name: ' + job.CronJobDetail.Name 
                 + ' | Type: ' + job.CronJobDetail.JobType
                 + ' | State: ' + job.State
                 + ' | Next Run: ' + job.NextFireTime);
}
System.debug('--- SCHEDULED JOBS END ---');

// 2. Fetch and debug Queued Batch Jobs from AsyncApexJob
List<AsyncApexJob> batchJobs = [ SELECT Id, Status, JobType, ApexClass.Name, CreatedDate FROM AsyncApexJob WHERE JobType = 'BatchApex' AND Status = 'Queued'];

System.debug('--- QUEUED BATCH JOBS START ---');
for (AsyncApexJob batch : batchJobs) {
    System.debug('Class Name: ' + batch.ApexClass.Name 
                 + ' | Status: ' + batch.Status 
                 + ' | Created: ' + batch.CreatedDate);
}
System.debug('--- QUEUED BATCH JOBS END ---');
