<template>
  <div class="project-grid">
    <!-- Grid Header -->
    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="text-h5">Projects</h2>
      <div class="d-flex align-center">
        <!-- View Toggle -->
        <v-btn-toggle v-model="viewMode" mandatory>
          <v-btn value="grid" size="small">
            <v-icon>mdi-view-grid</v-icon>
          </v-btn>
          <v-btn value="list" size="small">
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
        </v-btn-toggle>
        
        <!-- Filter Dropdown -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn 
              v-bind="props" 
              variant="outlined" 
              size="small" 
              class="ml-2"
              prepend-icon="mdi-filter"
            >
              Filter
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="filterByStatus('all')">
              <v-list-item-title>All Projects</v-list-item-title>
            </v-list-item>
            <v-list-item @click="filterByStatus('active')">
              <v-list-item-title>Active</v-list-item-title>
            </v-list-item>
            <v-list-item @click="filterByStatus('planning')">
              <v-list-item-title>Planning</v-list-item-title>
            </v-list-item>
            <v-list-item @click="filterByStatus('completed')">
              <v-list-item-title>Completed</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <!-- Quick Add Project -->
    <v-card 
      v-if="showQuickAdd" 
      class="mb-4 project-quick-add"
      elevation="1"
    >
      <v-card-text>
        <v-form @submit.prevent="addProject">
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="newProject.name"
                label="Project name"
                placeholder="Enter project name..."
                :rules="nameRules"
                required
                autofocus
                @keyup.enter="addProject"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <div class="d-flex">
                <v-btn 
                  type="submit" 
                  color="primary" 
                  :loading="adding"
                  class="mr-2"
                >
                  Add
                </v-btn>
                <v-btn 
                  variant="outlined" 
                  @click="cancelQuickAdd"
                >
                  Cancel
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Add Project Button -->
    <v-card 
      v-else
      class="mb-4 project-add-card" 
      elevation="1"
      @click="showQuickAddForm"
    >
      <v-card-text class="text-center py-8">
        <v-icon size="48" color="primary">mdi-plus-circle</v-icon>
        <h3 class="mt-2">Add New Project</h3>
        <p class="text-grey">Click to create a new project</p>
      </v-card-text>
    </v-card>

    <!-- Projects Grid/List -->
    <div v-if="filteredProjects.length > 0">
      <!-- Grid View -->
      <v-row v-if="viewMode === 'grid'">
        <v-col 
          v-for="project in filteredProjects" 
          :key="project.id" 
          cols="12" 
          sm="6" 
          lg="4"
        >
          <ProjectCard 
            :project="project" 
            @open-project="handleOpenProject"
          />
        </v-col>
      </v-row>

      <!-- List View -->
      <v-list v-else>
        <v-list-item
          v-for="project in filteredProjects"
          :key="project.id"
          @click="handleOpenProject(project)"
        >
          <template v-slot:prepend>
            <v-icon :color="getStatusColor(project.status)">
              {{ getStatusIcon(project.status) }}
            </v-icon>
          </template>
          
          <v-list-item-title>{{ project.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ project.description }}</v-list-item-subtitle>
          
          <template v-slot:append>
            <div class="d-flex align-center">
              <v-progress-circular 
                :value="project.progress" 
                :color="getProgressColor(project.progress)"
                size="24"
                width="3"
                class="mr-3"
              ></v-progress-circular>
              <span class="text-caption mr-3">{{ project.progress }}%</span>
              <v-chip 
                v-if="project.priority === 'high'" 
                color="error" 
                size="small"
              >
                High
              </v-chip>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </div>

    <!-- Empty State -->
    <v-card v-else class="text-center py-8">
      <v-card-text>
        <v-icon size="64" color="grey-lighten-1">mdi-folder-open</v-icon>
        <h3 class="mt-2">No projects found</h3>
        <p class="text-grey">Create your first project to get started</p>
        <v-btn color="primary" @click="showQuickAddForm" class="mt-2">
          Create Project
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import ProjectCard from './ProjectCard.vue';

export default {
  name: 'ProjectGrid',
  components: {
    ProjectCard
  },
  data() {
    return {
      viewMode: 'grid',
      showQuickAdd: false,
      adding: false,
      statusFilter: 'all',
      newProject: {
        name: ''
      },
      nameRules: [
        v => !!v || 'Project name is required',
        v => (v && v.length >= 3) || 'Name must be at least 3 characters'
      ],
      projects: [
        {
          id: 1,
          name: 'Website Redesign',
          description: 'Complete overhaul of company website with modern design',
          status: 'active',
          priority: 'high',
          progress: 75,
          taskCount: 12,
          completedTasks: 9,
          daysLeft: 15,
          dueDate: '2024-02-15',
          members: [
            { id: 1, name: 'John', avatar: null },
            { id: 2, name: 'Sarah', avatar: null },
            { id: 3, name: 'Mike', avatar: null }
          ]
        },
        {
          id: 2,
          name: 'Mobile App',
          description: 'iOS and Android app development for customer portal',
          status: 'active',
          priority: 'normal',
          progress: 45,
          taskCount: 8,
          completedTasks: 4,
          daysLeft: 30,
          dueDate: '2024-03-01',
          members: [
            { id: 4, name: 'Alex', avatar: null },
            { id: 5, name: 'Emma', avatar: null }
          ]
        },
        {
          id: 3,
          name: 'Database Migration',
          description: 'Migrate legacy database to new cloud infrastructure',
          status: 'completed',
          priority: 'normal',
          progress: 100,
          taskCount: 5,
          completedTasks: 5,
          daysLeft: 0,
          dueDate: '2024-01-20',
          members: [
            { id: 6, name: 'David', avatar: null }
          ]
        },
        {
          id: 4,
          name: 'Marketing Campaign',
          description: 'Q1 marketing campaign for new product launch',
          status: 'planning',
          priority: 'normal',
          progress: 20,
          taskCount: 6,
          completedTasks: 1,
          daysLeft: 45,
          dueDate: '2024-03-15',
          members: [
            { id: 7, name: 'Lisa', avatar: null },
            { id: 8, name: 'Tom', avatar: null }
          ]
        }
      ]
    };
  },
  computed: {
    filteredProjects() {
      if (this.statusFilter === 'all') return this.projects;
      return this.projects.filter(project => project.status === this.statusFilter);
    }
  },
  methods: {
    showQuickAddForm() {
      this.showQuickAdd = true;
      this.$nextTick(() => {
        // Focus on the input field
        const input = this.$el.querySelector('input');
        if (input) input.focus();
      });
    },
    cancelQuickAdd() {
      this.showQuickAdd = false;
      this.newProject.name = '';
    },
    async addProject() {
      if (!this.newProject.name.trim()) return;
      
      this.adding = true;
      try {
        const project = {
          id: Date.now(), // Temporary ID
          name: this.newProject.name,
          description: '',
          status: 'planning',
          priority: 'normal',
          progress: 0,
          taskCount: 0,
          completedTasks: 0,
          daysLeft: 30,
          dueDate: null,
          members: []
        };
        
        this.projects.unshift(project);
        this.cancelQuickAdd();
        
        this.$emit('project-created', project);
        
      } catch (error) {
        console.error('Error creating project:', error);
      } finally {
        this.adding = false;
      }
    },
    filterByStatus(status) {
      this.statusFilter = status;
    },
    handleOpenProject(project) {
      this.$emit('open-project', project);
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
    }
  }
};
</script>

<style scoped>
.project-grid {
  padding: 16px 0;
}

.project-add-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-add-card:hover {
  background-color: #f5f5f5;
}

.project-quick-add {
  border: 2px dashed #1976d2;
  background-color: #f3f8ff;
}
</style>
