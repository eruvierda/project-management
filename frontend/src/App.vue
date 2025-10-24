<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Project Management</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <!-- Global Search -->
      <v-autocomplete
        v-model="globalSearch"
        :items="searchResults"
        :loading="searchLoading"
        prepend-icon="mdi-magnify"
        label="Search projects, tasks..."
        hide-details
        single-line
        style="max-width: 300px;"
        class="mr-4"
        @input="handleSearch"
        @update:modelValue="handleSearchSelect"
        clearable
        no-data-text="No results found"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-icon :color="getSearchItemColor(item.raw.type)">
                {{ getSearchItemIcon(item.raw.type) }}
              </v-icon>
            </template>
            <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.raw.subtitle }}</v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-autocomplete>
      
      <WorkspaceSwitcher 
        @workspace-switched="handleWorkspaceSwitch"
        @create-workspace="showCreateWorkspace = true"
      />
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard"></v-list-item>
        <v-list-item prepend-icon="mdi-folder" title="Projects" value="projects"></v-list-item>
        <v-list-item prepend-icon="mdi-format-list-checks" title="My Tasks" value="my-tasks"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" title="Team" value="team"></v-list-item>
        <v-list-item prepend-icon="mdi-cog" title="Settings" value="settings"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <!-- Main Content Area -->
        <v-row>
          <v-col cols="12">
            <h1 class="text-h4 mb-6">Welcome to {{ currentWorkspace?.name || 'your workspace' }}</h1>
            
            <!-- Quick Actions -->
            <v-row class="mb-6">
              <v-col cols="12" md="4">
                <v-card class="pa-4" @click="showCreateProject = true">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary">mdi-plus-circle</v-icon>
                    <h3 class="mt-2">Create Project</h3>
                    <p class="text-grey">Start a new project</p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="pa-4">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="success">mdi-account-plus</v-icon>
                    <h3 class="mt-2">Invite Team</h3>
                    <p class="text-grey">Add team members</p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="pa-4">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="info">mdi-chart-line</v-icon>
                    <h3 class="mt-2">View Reports</h3>
                    <p class="text-grey">Project analytics</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Projects Grid -->
            <ProjectGrid 
              @open-project="handleOpenProject"
              @project-created="handleProjectCreated"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Create Workspace Dialog -->
    <v-dialog v-model="showCreateWorkspace" max-width="600">
      <CreateWorkspace 
        @workspace-created="handleWorkspaceCreated"
        @show-snackbar="showSnackbar"
      />
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script>
import CreateWorkspace from './components/CreateWorkspace.vue';
import WorkspaceSwitcher from './components/WorkspaceSwitcher.vue';
import ProjectGrid from './components/ProjectGrid.vue';

export default {
  name: 'App',
  components: {
    CreateWorkspace,
    WorkspaceSwitcher,
    ProjectGrid,
  },
  data() {
    return {
      drawer: false,
      globalSearch: '',
      searchResults: [],
      searchLoading: false,
      searchTimeout: null,
      showCreateWorkspace: false,
      currentWorkspace: null,
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      }
    };
  },
  methods: {
    handleWorkspaceSwitch(workspace) {
      this.currentWorkspace = workspace;
      console.log('Workspace switched to:', workspace);
    },
    handleWorkspaceCreated(workspace) {
      this.showCreateWorkspace = false;
      console.log('New workspace created:', workspace);
    },
    handleSearch() {
      // Clear previous timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      // If search is empty, clear results
      if (!this.globalSearch || this.globalSearch.length < 2) {
        this.searchResults = [];
        return;
      }
      
      // Debounce search
      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 300);
    },
    async performSearch() {
      this.searchLoading = true;
      try {
        // Simulate API call - replace with actual search endpoint
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock search results
        const mockResults = [
          {
            title: 'Website Redesign',
            subtitle: 'Project • Active • 75% complete',
            type: 'project',
            id: 1
          },
          {
            title: 'Fix login bug',
            subtitle: 'Task • Website Redesign • High Priority',
            type: 'task',
            id: 101
          },
          {
            title: 'Update user interface',
            subtitle: 'Task • Mobile App • Medium Priority',
            type: 'task',
            id: 102
          },
          {
            title: 'Database optimization',
            subtitle: 'Comment • Database Migration • 2 hours ago',
            type: 'comment',
            id: 201
          }
        ];
        
        // Filter results based on search query
        const query = this.globalSearch.toLowerCase();
        this.searchResults = mockResults.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.subtitle.toLowerCase().includes(query)
        );
        
      } catch (error) {
        console.error('Search error:', error);
        this.searchResults = [];
      } finally {
        this.searchLoading = false;
      }
    },
    handleSearchSelect(item) {
      if (!item) return;
      
      console.log('Selected search item:', item);
      
      // Navigate based on item type
      switch (item.type) {
        case 'project':
          this.handleOpenProject({ id: item.id });
          break;
        case 'task':
          // TODO: Navigate to task detail
          console.log('Opening task:', item.id);
          break;
        case 'comment':
          // TODO: Navigate to comment context
          console.log('Opening comment:', item.id);
          break;
      }
      
      // Clear search after selection
      this.globalSearch = '';
      this.searchResults = [];
    },
    getSearchItemColor(type) {
      const colors = {
        'project': 'primary',
        'task': 'success',
        'comment': 'info'
      };
      return colors[type] || 'grey';
    },
    getSearchItemIcon(type) {
      const icons = {
        'project': 'mdi-folder',
        'task': 'mdi-check-circle',
        'comment': 'mdi-comment'
      };
      return icons[type] || 'mdi-help-circle';
    },
    handleOpenProject(project) {
      console.log('Opening project:', project);
      // TODO: Navigate to project detail view
    },
    handleProjectCreated(project) {
      console.log('Project created:', project);
      this.showSnackbar({
        message: 'Project created successfully!',
        color: 'success'
      });
    },
    showSnackbar(data) {
      this.snackbar = {
        show: true,
        message: data.message,
        color: data.color
      };
    }
  }
};
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>
