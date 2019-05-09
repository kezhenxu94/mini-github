const computedBehavior = require('../../lib/computed.js')
const utils = require('../../utils/util.js')
const theming = require('../../behaviours/theming.js')

Component({
  behaviors: [computedBehavior, theming],

  properties: {
    timeline: {
      type: Object,
      value: {}
    }
  },

  computed: {
    icon() {
      const t = this.data.timeline
      const theme = this.data.theme
      switch (t.event) {
        case 'labeled':
        case 'unlabeled':
          return `${utils.iconFolder(theme)}/tag.svg`
        case 'assigned':
        case 'unassigned':
          return `${utils.iconFolder(theme)}/person.svg`
        case 'milestoned':
        case 'demilestoned':
          return `${utils.iconFolder(theme)}/milestone.svg`
        case 'closed':
          return `${utils.iconFolder(theme)}/issue-closed.svg`
        case 'reopened':
          return `${utils.iconFolder(theme)}/issue-reopened.svg`
        case 'referenced':
        case 'cross-referenced':
          return `${utils.iconFolder(theme)}/bookmark.svg`
        case 'locked':
        case 'unlocked':
          return `${utils.iconFolder(theme)}/lock.svg`
        case 'pinned':
        case 'unpinned':
          return `${utils.iconFolder(theme)}/pin.svg`
        case 'renamed':
          return `${utils.iconFolder(theme)}/pencil.svg`
        case 'review_requested':
        case 'reviewed':
        case 'ready_for_review':
          return `${utils.iconFolder(theme)}/eye.svg`
        case 'review_dismissed':
        case 'comment_deleted':
          return `${utils.iconFolder(theme)}/x.svg`
        case 'merged':
          return `${utils.iconFolder(theme)}/git-merge.svg`
        case 'head_ref_deleted':
        case 'head_ref_restored':
          return `${utils.iconFolder(theme)}/git-branch.svg`
        case 'marked_as_duplicate':
          return `${utils.iconFolder(theme)}/bookmark.svg`
        case 'added_to_project':
        case 'removed_from_project':
          return `${utils.iconFolder(theme)}/project.svg`
      }
    },

    desc () {
      const t = this.data.timeline
      if (t.event === 'labeled' || t.event === 'unlabeled') {
        return `${t.actor.login} ${t.event} "${t.label.name}" ${t.created_at}`
      } else if (t.event === 'assigned' || t.event === 'unassigned') {
        return `${t.actor.login} ${t.event} ${t.assignee.login} ${t.created_at}`
      } else if (t.event === 'milestoned') {
        return `${t.actor.login} added this to the ${t.milestone.title} milestone ${t.created_at}`
      } else if (t.event === 'demilestoned') {
        return `${t.actor.login} remove this from the ${t.milestone.title} milestone ${t.created_at}`
      } else if (t.event === 'closed') {
        return `${t.actor.login} closed this ${t.created_at}`
      } else if (t.event === 'reopened') {
        return `${t.actor.login} reopened this ${t.created_at}`
      } else if (t.event === 'head_ref_force_pushed') {
        return `${t.actor.login} force-pushed this ${t.created_at}`
      } else if (t.event === 'review_requested') {
        return `${t.actor.login} requested a review from ${t.requested_reviewer.login} ${t.created_at}`
      } else if (t.event === 'referenced') {
        return `${t.actor.login} added a commit that referenced this issue ${t.commit_id.slice(0, 8)} ${t.created_at}`
      } else if (t.event === 'cross-referenced') {
        return `${t.actor.login} referenced this in ${t.source.type} #${t.source.issue.number} ${t.created_at}`
      } else if (t.event === 'locked' || t.event === 'unlocked') {
        return `${t.actor.login} ${t.event} this ${t.created_at}`
      } else if (t.event === 'pinned' || t.event === 'unpinned') {
        return `${t.actor.login} ${t.event} this ${t.created_at}`
      } else if (t.event === 'renamed') {
        return `${t.actor.login} changed the title from "${t.rename.from}" to "${t.rename.to}" ${t.created_at}`
      } else if (t.event === 'reviewed') {
        return `${t.user.login} reviewed ${t.submitted_at}`
      } else if (t.event === 'review_dismissed') {
        return `${t.actor.login} dismissed stale reviews ${t.created_at}`
      } else if (t.event === 'merged') {
        return `${t.actor.login} merged ${t.commit_id.slice(0, 8)} ${t.created_at}`
      } else if (t.event === 'head_ref_deleted') {
        return `${t.actor.login} delete the branch ${t.created_at}`
      } else if (t.event === 'head_ref_restored') {
        return `${t.actor.login} restored the branch ${t.created_at}`
      } else if (t.event === 'marked_as_duplicate') {
        return `${t.actor.login} mark this as duplicated ${t.created_at}`
      } else if (t.event === 'added_to_project') {
        return `${t.actor.login} added this to project ${t.created_at}`
      } else if (t.event === 'removed_from_project') {
        return `${t.actor.login} removed this from project ${t.created_at}`
      } else if (t.event === 'ready_for_review') {
        return `${t.actor.login} marked this pull request as ready for review ${t.created_at}`
      } else if (t.event === 'comment_deleted') {
        return `${t.actor.login} deleted a comment ${t.created_at}`
      }
    }
  }
})
