const computedBehavior = require('../../lib/computed.js')
const utils = require('../../utils/util.js')

Component({
  behaviors: [computedBehavior],

  properties: {
    timeline: {
      type: Object,
      value: {}
    }
  },

  computed: {
    icon() {
      const t = this.data.timeline
      switch (t.event) {
        case 'labeled':
        case 'unlabeled':
          return '/octicons/tag.png'
        case 'assigned':
        case 'unassigned':
          return '/octicons/person.png'
        case 'milestoned':
        case 'demilestoned':
          return '/octicons/milestone.png'
        case 'closed':
          return '/octicons/issue-closed.png'
        case 'reopened':
          return '/octicons/issue-reopened.png'
        case 'referenced':
        case 'cross-referenced':
          return '/octicons/bookmark.png'
        case 'locked':
        case 'unlocked':
          return '/octicons/lock.png'
        case 'pinned':
        case 'unpinned':
          return '/octicons/pin.png'
        case 'renamed':
          return '/octicons/pencil.png'
        case 'review_requested':
        case 'reviewed':
          return '/octicons/eye.png'
        case 'review_dismissed':
          return '/octicons/x.png'
        case 'merged':
          return '/octicons/git-merge.png'
        case 'head_ref_deleted':
        case 'head_ref_restored':
          return '/octicons/git-branch.png'
        case 'marked_as_duplicate':
          return '/octicons/bookmark.png'
        case 'added_to_project':
        case 'removed_from_project':
          return '/octicons/project.png'
      }
    },

    desc () {
      const t = this.data.timeline
      if (t.event === 'labeled' || t.event === 'unlabeled') {
        return `${t.actor.login} ${t.event} "${t.label.name}" ${utils.toReadableTime(t.created_at)}`
      } else if (t.event === 'assigned' || t.event === 'unassigned') {
        return `${t.actor.login} ${t.event} ${t.assignee.login} ${utils.toReadableTime(t.created_at)}`
      } else if (t.event === 'milestoned') {
        return `${t.actor.login} added this to the ${t.milestone.title} milestone ${utils.toReadableTime(t.created_at)}`
      } else if (t.event === 'demilestoned') {
        return `${t.actor.login} remove this from the ${t.milestone.title} milestone ${utils.toReadableTime(t.created_at)}`
      } else if (t.event === 'closed') {
        return `${t.actor.login} closed this ${utils.toReadableTime(t.created_at)}`
      } else if (t.event === 'reopened') {
        return `${t.actor.login} reopened this ${utils.toReadableTime(t.created_at)}`
      } else if (t.event === 'head_ref_force_pushed') {
        return `${t.actor.login} force-pushed this ${utils.toReadableTime(t.created_at)}`
      } else if (t.event === 'review_requested') {
        return `${t.actor.login} requested a review from ${t.requested_reviewer.login} ${utils.toReadableTime(t.created_at)}`
      } else if (t.event === 'referenced') {
        return `${t.actor.login} added a commit that referenced this issue ${t.commit_id.slice(0, 8)} ${utils.toReadableTime(t.created_at)}`
      } else if (t.event === 'cross-referenced') {
        return `${t.actor.login} referenced this in ${t.source.type} #${t.source.issue.number} ${utils.toReadableTime(t.created_at)}`
      } else if (t.event === 'locked' || t.event === 'unlocked') {
        return `${t.actor.login} ${t.event} this ${utils.toReadableTime(t.created_at)}`
      } else if (t.event === 'pinned' || t.event === 'unpinned') {
        return `${t.actor.login} ${t.event} this ${utils.toReadableTime(t.created_at)}`
      } else if (t.event === 'renamed') {
        return `${t.actor.login} changed the title from "${t.rename.from}" to "${t.rename.to}" ${utils.toReadableTime(t.created_at)}`
      } else if (t.event === 'reviewed') {
        return `${t.user.login} reviewed ${utils.toReadableTime(t.submitted_at)}`
      } else if (t.event === 'review_dismissed') {
        return `${t.actor.login} dismissed stale reviews ${utils.toReadableTime(t.submitted_at)}`
      } else if (t.event === 'merged') {
        return `${t.actor.login} merged ${t.commit_id.slice(0, 8)} ${utils.toReadableTime(t.submitted_at)}`
      } else if (t.event === 'head_ref_deleted') {
        return `${t.actor.login} delete the branch ${utils.toReadableTime(t.submitted_at)}`
      } else if (t.event === 'head_ref_restored') {
        return `${t.actor.login} restored the branch ${utils.toReadableTime(t.submitted_at)}`
      } else if (t.event === 'marked_as_duplicate') {
        return `${t.actor.login} mark this as duplicated ${utils.toReadableTime(t.submitted_at)}`
      } else if (t.event === 'added_to_project') {
        return `${t.actor.login} added this to project ${utils.toReadableTime(t.submitted_at)}`
      } else if (t.event === 'removed_from_project') {
        return `${t.actor.login} removed this from project ${utils.toReadableTime(t.submitted_at)}`
      }
    }
  },

  data: {

  },

  methods: {

  }
})
