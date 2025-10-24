<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        variant="text"
        prepend-icon="mdi-domain"
        class="text-none"
      >
        {{ currentWorkspace?.name || 'Select Workspace' }}
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    
    <v-list>
      <v-list-subheader>Recent Workspaces</v-list-subheader>
      <v-list-item
        v-for="workspace in recentWorkspaces"
        :key="workspace.id"
        :value="workspace.id"
        @click="switchWorkspace(workspace)"
        :active="workspace.id === selectedWorkspace"
      >
        <template v-slot:prepend>
          <v-avatar color="primary" size="32">
            <span class="text-white">{{ workspace.name.charAt(0).toUpperCase() }}</span>
          </v-avatar>
        </template>
        <v-list-item-title>{{ workspace.name }}</v-list-item-title>
        <v-list-item-subtitle v-if="workspace.description">
          {{ workspace.description }}
        </v-list-item-subtitle>
      </v-list-item>
      
      <v-divider></v-divider>
      
      <v-list-item @click="showAllWorkspaces = true">
        <template v-slot:prepend>
          <v-icon>mdi-magnify</v-icon>
        </template>
        <v-list-item-title>Browse all workspaces</v-list-item-title>
      </v-list-item>
      
      <v-list-item @click="$emit('create-workspace')">
        <template v-slot:prepend>
          <v-icon>mdi-plus</v-icon>
        </template>
        <v-list-item-title>Create new workspace</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  
  <!-- All Workspaces Dialog -->
  <v-dialog v-model="showAllWorkspaces" max-width="600">
    <v-card>
      <v-card-title>All Workspaces</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="searchQuery"
          prepend-icon="mdi-magnify"
          label="Search workspaces"
          clearable
        ></v-text-field>
        
        <v-list>
          <v-list-item
            v-for="workspace in filteredWorkspaces"
            :key="workspace.id"
            @click="switchWorkspace(workspace)"
            :active="workspace.id === selectedWorkspace"
          >
            <template v-slot:prepend>
              <v-avatar color="primary" size="40">
                <span class="text-white">{{ workspace.name.charAt(0).toUpperCase() }}</span>
              </v-avatar>
            </template>
            <v-list-item-title>{{ workspace.name }}</v-list-item-title>
            <v-list-item-subtitle v-if="workspace.description">
              {{ workspace.description }}
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="workspace.memberCount">
              {{ workspace.memberCount }} members
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="showAllWorkspaces = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'WorkspaceSwitcher',
  data() {
    return {
      selectedWorkspace: 1,
      showAllWorkspaces: false,
      searchQuery: '',
      workspaces: [
        { 
          id: 1, 
          name: 'My Company', 
          description: 'Main company workspace',
          memberCount: 12,
          lastAccessed: new Date()
        },
        { 
          id: 2, 
          name: 'Side Projects', 
          description: 'Personal projects and experiments',
          memberCount: 3,
          lastAccessed: new Date(Date.now() - 86400000)
        },
        { 
          id: 3, 
          name: 'Client Work', 
          description: 'Client projects and collaborations',
          memberCount: 8,
          lastAccessed: new Date(Date.now() - 172800000)
        },
        { 
          id: 4, 
          name: 'Team Alpha', 
          description: 'Development team workspace',
          memberCount: 5,
          lastAccessed: new Date(Date.now() - 259200000)
        },
      ],
    };
  },
  computed: {
    currentWorkspace() {
      return this.workspaces.find(w => w.id === this.selectedWorkspace);
    },
    recentWorkspaces() {
      return this.workspaces
        .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
        .slice(0, 3);
    },
    filteredWorkspaces() {
      if (!this.searchQuery) return this.workspaces;
      
      const query = this.searchQuery.toLowerCase();
      return this.workspaces.filter(workspace => 
        workspace.name.toLowerCase().includes(query) ||
        (workspace.description && workspace.description.toLowerCase().includes(query))
      );
    }
  },
  methods: {
    switchWorkspace(workspace) {
      this.selectedWorkspace = workspace.id;
      this.showAllWorkspaces = false;
      
      // Update last accessed time
      workspace.lastAccessed = new Date();
      
      // Emit event to parent component
      this.$emit('workspace-switched', workspace);
      
      console.log('Switching to workspace:', workspace);
    }
  }
};
</script>
