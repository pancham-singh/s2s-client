import { QueryBuilder } from 'objection';

class SoftDeleteQueryBuilder extends QueryBuilder {
  constructor(modelClass) {
    super(modelClass);

    this.onBuild((builder) => {
      if (!builder.context().withArchived) {
        builder.whereNull(`${modelClass.tableName}.deleted_at`);
      }
    });
  }

  withArchived(withArchived: boolean) {
    this.context().withArchived = withArchived;
    return this;
  }

  softDelete() {
    return this.patch({ deleted_at: new Date() });
  }
}
export default SoftDeleteQueryBuilder;
