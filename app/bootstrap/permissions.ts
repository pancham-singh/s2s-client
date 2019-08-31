import * as Knex from 'knex';

let permissions = [
  {
    id: 1,
    name: 'user:read',
    description: 'Can list users and view user details.'
  },
  {
    id: 2,
    name: 'user:delete',
    description: 'Can delete other users.'
  },
  {
    id: 3,
    name: 'user:write',
    description: 'Can create new users and change user details.'
  },
  {
    id: 4,
    name: 'course:read',
    description: 'Can list courses and view course details.'
  },
  {
    id: 5,
    name: 'course:write',
    description: 'Can create course and change course details.'
  },
  {
    id: 6,
    name: 'course:delete',
    description: 'Can delete a course.'
  },
  {
    id: 7,
    name: 'topic:read',
    description: 'Can list topics and view topic details.'
  },
  {
    id: 8,
    name: 'topic:write',
    description: 'Can create topic and change topic details.'
  },
  {
    id: 9,
    name: 'topic:delete',
    description: 'Can delete a topic.'
  },
  {
    id: 10,
    name: 'question:read',
    description: 'Can list questions and view question details.'
  },
  {
    id: 11,
    name: 'question:write',
    description: 'Can create question and change question details.'
  },
  {
    id: 12,
    name: 'question:delete',
    description: 'Can delete a question.'
  },
  {
    id: 13,
    name: 'answer:read',
    description: 'Can list answers and view answer details.'
  },
  {
    id: 14,
    name: 'answer:write',
    description: 'Can create answer and change answer details.'
  },
  {
    id: 15,
    name: 'answer:delete',
    description: 'Can delete an answer.'
  },
  {
    id: 16,
    name: 'batch:read',
    description: 'Can list batchs and view batch details.'
  },
  {
    id: 17,
    name: 'batch:write',
    description: 'Can create batch and change batch details.'
  },
  {
    id: 18,
    name: 'batch:delete',
    description: 'Can delete a batch.'
  },
  {
    id: 19,
    name: 'assessment:read',
    description: 'Can list assessments and view assessment details.'
  },
  {
    id: 20,
    name: 'assessment:write',
    description: 'Can create assessment and change assessment details.'
  },
  {
    id: 21,
    name: 'assessment:delete',
    description: 'Can delete an assessment.'
  },
  {
    id: 22,
    name: 'video:read',
    description: 'Can list videos and view video details.'
  },
  {
    id: 23,
    name: 'video:write',
    description: 'Can create video and change video details.'
  },
  {
    id: 24,
    name: 'video:delete',
    description: 'Can delete an video.'
  },
  {
    id: 25,
    name: 'trainingCenter:read',
    description: 'Can list training-centers and view training-center details.'
  },
  {
    id: 26,
    name: 'trainingCenter:write',
    description: 'Can create training-center and change training-center details.'
  },
  {
    id: 27,
    name: 'trainingCenter:delete',
    description: 'Can delete an training-center.'
  },
  {
    id: 28,
    name: 'user:read:own',
    description: 'Can list users and view user details.. Restricted to those "owned" by user'
  },
  {
    id: 29,
    name: 'user:delete:own',
    description: 'Can delete other users.. Restricted to those "owned" by user'
  },
  {
    id: 30,
    name: 'user:write:own',
    description:
      'Can create new users and change user details.. Restricted to those "owned" by user'
  },
  {
    id: 31,
    name: 'course:read:own',
    description: 'Can list courses and view course details.. Restricted to those "owned" by user'
  },
  {
    id: 32,
    name: 'course:write:own',
    description: 'Can create course and change course details.. Restricted to those "owned" by user'
  },
  {
    id: 33,
    name: 'course:delete:own',
    description: 'Can delete a course.. Restricted to those "owned" by user'
  },
  {
    id: 34,
    name: 'topic:read:own',
    description: 'Can list topics and view topic details.. Restricted to those "owned" by user'
  },
  {
    id: 35,
    name: 'topic:write:own',
    description: 'Can create topic and change topic details.. Restricted to those "owned" by user'
  },
  {
    id: 36,
    name: 'topic:delete:own',
    description: 'Can delete a topic.. Restricted to those "owned" by user'
  },
  {
    id: 37,
    name: 'question:read:own',
    description:
      'Can list questions and view question details.. Restricted to those "owned" by user'
  },
  {
    id: 38,
    name: 'question:write:own',
    description:
      'Can create question and change question details.. Restricted to those "owned" by user'
  },
  {
    id: 39,
    name: 'question:delete:own',
    description: 'Can delete a question.. Restricted to those "owned" by user'
  },
  {
    id: 40,
    name: 'answer:read:own',
    description: 'Can list answers and view answer details.. Restricted to those "owned" by user'
  },
  {
    id: 41,
    name: 'answer:write:own',
    description: 'Can create answer and change answer details.. Restricted to those "owned" by user'
  },
  {
    id: 42,
    name: 'answer:delete:own',
    description: 'Can delete an answer.. Restricted to those "owned" by user'
  },
  {
    id: 43,
    name: 'batch:read:own',
    description: 'Can list batchs and view batch details.. Restricted to those "owned" by user'
  },
  {
    id: 44,
    name: 'batch:write:own',
    description: 'Can create batch and change batch details.. Restricted to those "owned" by user'
  },
  {
    id: 45,
    name: 'batch:delete:own',
    description: 'Can delete a batch.. Restricted to those "owned" by user'
  },
  {
    id: 46,
    name: 'assessment:read:own',
    description:
      'Can list assessments and view assessment details.. Restricted to those "owned" by user'
  },
  {
    id: 47,
    name: 'assessment:write:own',
    description:
      'Can create assessment and change assessment details.. Restricted to those "owned" by user'
  },
  {
    id: 48,
    name: 'assessment:delete:own',
    description: 'Can delete an assessment.. Restricted to those "owned" by user'
  },
  {
    id: 49,
    name: 'video:read:own',
    description: 'Can list videos and view video details.. Restricted to those "owned" by user'
  },
  {
    id: 50,
    name: 'video:write:own',
    description: 'Can create video and change video details.. Restricted to those "owned" by user'
  },
  {
    id: 51,
    name: 'video:delete:own',
    description: 'Can delete an video.. Restricted to those "owned" by user'
  },
  {
    id: 52,
    name: 'trainingCenter:read:own',
    description:
      'Can list training-centers and view training-center details.. Restricted to those "owned" by user'
  },
  {
    id: 53,
    name: 'trainingCenter:write:own',
    description:
      'Can create training-center and change training-center details.. Restricted to those "owned" by user'
  },
  {
    id: 54,
    name: 'trainingCenter:delete:own',
    description: 'Can delete an training-center.. Restricted to those "owned" by user'
  },
  {
    id: 55,
    name: 'module:read',
    description: 'Can list modules and view module details.'
  },
  {
    id: 56,
    name: 'module:write',
    description: 'Can create module and change module details.'
  },
  {
    id: 57,
    name: 'module:delete',
    description: 'Can delete a module.'
  },
  {
    id: 58,
    name: 'module:read:own',
    description: 'Can list modules and view module details. Restricted to those "owned" by user'
  },
  {
    id: 59,
    name: 'module:write:own',
    description: 'Can create module and change module details. Restricted to those "owned" by user'
  },
  {
    id: 60,
    name: 'module:delete:own',
    description: 'Can delete a module. Restricted to those "owned" by user'
  },
  {
    id: 61,
    name: 'attachment:read',
    description: 'Can list attachments and view attachment details.'
  },
  {
    id: 62,
    name: 'attachment:write',
    description: 'Can create attachment and change attachment details.'
  },
  {
    id: 63,
    name: 'attachment:delete',
    description: 'Can delete a attachment.'
  },
  {
    id: 64,
    name: 'attachment:read:own',
    description:
      'Can list attachments and view attachment details. Restricted to those "owned" by user'
  },
  {
    id: 65,
    name: 'attachment:write:own',
    description:
      'Can create attachment and change attachment details. Restricted to those "owned" by user'
  },
  {
    id: 66,
    name: 'attachment:delete:own',
    description: 'Can delete a attachment. Restricted to those "owned" by user'
  },
  {
    id: 67,
    name: 'invitation:read',
    description: 'Can list invitations and view invitation details.'
  },
  {
    id: 68,
    name: 'invitation:write',
    description: 'Can create invitation and change invitation details.'
  },
  {
    id: 69,
    name: 'invitation:delete',
    description: 'Can delete a invitation.'
  },
  {
    id: 70,
    name: 'invitation:read:own',
    description:
      'Can list invitations and view invitation details. Restricted to those "owned" by user'
  },
  {
    id: 71,
    name: 'invitation:write:own',
    description:
      'Can create invitation and change invitation details. Restricted to those "owned" by user'
  },
  {
    id: 72,
    name: 'invitation:delete:own',
    description: 'Can delete a invitation. Restricted to those "owned" by user'
  }
];

export const createPermissions = async (knex: Knex): Promise<any> => {
  const createPermission = async (permission) => {
    const table = knex('permission');

    const existingPermission = await table
      .select()
      .where('id', '=', permission.id)
      .first();

    if (existingPermission) {
      return await table.update(permission).where('id', '=', permission.id);
    } else {
      return await table.insert(permission);
    }
  };

  for (const permission of permissions) {
    try {
      await createPermission(permission);
    } catch (err) {
      console.warn(`Failed to create permission: ${permission.name}`, err);
    }
  }
};

export default permissions;
