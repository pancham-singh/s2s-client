import { mergeSchemas } from 'graphql-tools';
import * as path from 'path';

import answerSchema from './answer';
import assessmentSchema from './assessment';
import attachmentSchema from './attachment';
import authSchema from './auth';
import batchSchema from './batch';
import courseSchema from './course';
import invitationSchema from './invitation';
import moduleSchema from './module';
import questionSchema from './question';
import topicSchema from './topic';
import trainingCenterSchema from './training-center';
import userListingSchema from './user';
import assessmentResultSchema from './assessment-result';

import assessmentAnserSchema from './assessment-answers';
export default mergeSchemas({
  schemas: [
    authSchema,
    courseSchema,
    topicSchema,
    moduleSchema,
    questionSchema,
    answerSchema,
    attachmentSchema,
    userListingSchema,
    trainingCenterSchema,
    invitationSchema,
    batchSchema,
    assessmentSchema,
    assessmentAnserSchema,
    assessmentResultSchema
  ]
});
