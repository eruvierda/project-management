<template>
  <v-card class="mx-auto" max-width="500">
    <v-card-title class="text-h5">Create New Workspace</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="createWorkspace" ref="form">
        <v-text-field
          v-model="workspaceName"
          label="Workspace Name"
          :rules="nameRules"
          required
          prepend-icon="mdi-domain"
        ></v-text-field>
        <v-textarea
          v-model="workspaceDescription"
          label="Description (Optional)"
          prepend-icon="mdi-text"
          rows="3"
        ></v-textarea>
        <v-row>
          <v-col cols="6">
            <v-btn 
              type="submit" 
              color="primary" 
              :loading="loading"
              block
            >
              Create Workspace
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn 
              color="grey" 
              variant="outlined"
              @click="resetForm"
              block
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'CreateWorkspace',
  data() {
    return {
      workspaceName: '',
      workspaceDescription: '',
      loading: false,
      nameRules: [
        v => !!v || 'Workspace name is required',
        v => (v && v.length >= 3) || 'Name must be at least 3 characters',
        v => (v && v.length <= 50) || 'Name must be less than 50 characters'
      ]
    };
  },
  methods: {
    async createWorkspace() {
      if (!this.$refs.form.validate()) return;
      
      this.loading = true;
      try {
        const workspaceData = {
          name: this.workspaceName,
          description: this.workspaceDescription
        };
        
        // TODO: Replace with actual API call
        console.log('Creating workspace:', workspaceData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.$emit('workspace-created', workspaceData);
        this.resetForm();
        
        // Show success message
        this.$emit('show-snackbar', {
          message: 'Workspace created successfully!',
          color: 'success'
        });
        
      } catch (error) {
        console.error('Error creating workspace:', error);
        this.$emit('show-snackbar', {
          message: 'Failed to create workspace. Please try again.',
          color: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.workspaceName = '';
      this.workspaceDescription = '';
      this.$refs.form.resetValidation();
    }
  }
};
</script>
