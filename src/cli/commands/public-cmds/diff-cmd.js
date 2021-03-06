/** @flow */
import chalk from 'chalk';
import Command from '../../command';
import { diff } from '../../../api/consumer';
import type { DiffResults } from '../../../consumer/component-ops/components-diff';

export default class Diff extends Command {
  name = 'diff [values...]';
  description = `show diff between components files
  bit diff => compare all modified components to their model version
  bit diff [ids...] => compare the specified components against their modified states
  bit diff [id] [version] => compare the specified version to used or modified files
  bit diff [id] [version] [to_version] => compare the specified version files to to_version files`;
  alias = '';
  opts = [];
  loader = true;

  action([values]: [string[]]): Promise<DiffResults[]> {
    return diff(values);
  }

  report(diffResults: DiffResults[]): string {
    return diffResults
      .map((diffResult) => {
        if (diffResult.hasDiff) {
          const title = chalk.green(`showing diff for ${chalk.bold(diffResult.id.toString())}`);
          // $FlowFixMe
          const files = diffResult.filesDiff.map(fileDiff => fileDiff.diffOutput).join('\n');
          return `${title}\n${files}`;
        }
        return chalk.red(`no diff for ${chalk.bold(diffResult.id.toString())}`);
      })
      .join('\n\n');
  }
}
