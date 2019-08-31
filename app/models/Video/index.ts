import { JsonSchema, Model } from 'objection';
import BaseModel from '../BaseModel';
import Topic from '../Topic';

class Video extends BaseModel {
  static tableName = 'video';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['title', 'youtubeId'],

    properties: {
      title: { type: 'string' },
      youtubeId: { type: 'string' }
    }
  };

  static relationMappings = {
    topics: {
      relation: Model.BelongsToOneRelation,
      modelClass: Topic,
      join: {
        from: 'video.topic_id',
        to: 'topic.id'
      }
    }
  };

  title: string;
  youtubeId: string;
  topics: Topic[];
}

export default Video;
