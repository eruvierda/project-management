<template>
  <v-card 
    class="project-card" 
    elevation="2" 
    :class="{ 'project-card--high-priority': project.priority === 'high' }"
    @click="openProject"
  >
    <!-- Project Header -->
    <v-card-title class="d-flex align-center">
      <v-icon 
        :color="getStatusColor(project.status)" 
        class="mr-2"
      >
        {{ getStatusIcon(project.status) }}
      </v-icon>
      <span class="text-h6">{{ project.name }}</span>
      
      <!-- Priority Badge -->
      <v-chip 
        v-if="project.priority === 'high'" 
        color="error" 
        size="small" 
        class="ml-auto"
      >
        High Priority
      </v-chip>
    </v-card-title>

    <!-- Project Description -->
    <v-card-text>
      <p class="text-grey mb-3">{{ project.description }}</p>
      
      <!-- Progress Bar -->
      <div class="mb-3">
        <div class="d-flex justify-space-between mb-1">
          <span class="text-caption">Progress</span>
          <span class="text-caption">{{ project.progress }}%</span>
        </div>
        <v-progress-linear 
          :value="project.progress" 
          :color="getProgressColor(project.progress)"
          height="8"
          rounded
        ></v-progress-linear>
      </div>

      <!-- Project Stats -->
      <v-row class="text-center">
        <v-col cols="4">
          <div class="text-h6">{{ project.taskCount }}</div>
          <div class="text-caption text-grey">Tasks</div>
        </v-col>
        <v-col cols="4">
          <div class="text-h6">{{ project.completedTasks }}</div>
          <div class="text-caption text-grey">Completed</div>
        </v-col>
        <v-col cols="4">
          <div class="text-h6">{{ project.daysLeft }}</div>
          <div class="text-caption text-grey">Days Left</div>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Project Footer -->
    <v-card-actions>
      <v-btn 
        size="small" 
        color="primary" 
        variant="text"
        @click.stop="openProject"
      >
        View Details
      </v-btn>
      
      <v-spacer></v-spacer>
      
      <!-- Team Members -->
      <div class="d-flex align-center">
        <v-avatar 
          v-for="member in project.members.slice(0, 3)" 
          :key="member.id"
          size="24" 
          class="ml-n2"
          :class="{ 'ml-0': member === project.members[0] }"
        >
          <v-img :src="member.avatar" v-if="member.avatar"></v-img>
          <span v-else class="text-caption">{{ member.name.charAt(0) }}</span>
        </v-avatar>
        
        <v-avatar 
          v-if="project.members.length > 3" 
          size="24" 
          color="grey-lighten-2"
          class="ml-n2"
        >
          <span class="text-caption">+{{ project.members.length - 3 }}</span>
        </v-avatar>
      </div>
    </v-card-actions>

    <!-- Due Date Badge -->
    <v-chip 
      v-if="project.dueDate && isOverdue(project.dueDate)"
      color="error" 
      size="small" 
      class="project-card__overdue-chip"
    >
      Overdue
    </v-chip>
  </v-card>
</template>

<script>
export default {
  name: 'ProjectCard',
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  methods: {
    openProject() {
      this.$emit('open-project', this.project);
    },
    getStatusColor(status) {
      const colors = {
        'planning': 'orange',
        'active': 'green',
        'on-hold': 'yellow',
        'completed': 'blue',
        'cancelled': 'red'
      };
      return colors[status] || 'grey';
    },
    getStatusIcon(status) {
      const icons = {
        'planning': 'mdi-clipboard-text',
        'active': 'mdi-play-circle',
        'on-hold': 'mdi-pause-circle',
        'completed': 'mdi-check-circle',
        'cancelled': 'mdi-cancel'
      };
      return icons[status] || 'mdi-help-circle';
    },
    getProgressColor(progress) {
      if (progress < 30) return 'error';
      if (progress < 70) return 'warning';
      return 'success';
    },
    isOverdue(dueDate) {
      return new Date(dueDate) < new Date();
    }
  }
};
</script>

<style scoped>
.project-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  position: relative;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.project-card--high-priority {
  border-left: 4px solid #f44336;
}

.project-card__overdue-chip {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
