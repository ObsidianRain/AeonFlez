/**
 * AeonFlez Database Service
 * Connects to Supabase (primary database) and Airtable (alternative storage)
 */

// Configuration - Replace these with your actual credentials
const DB_CONFIG = {
    supabase: {
        url: 'YOUR_SUPABASE_URL',
        anonKey: 'YOUR_SUPABASE_ANON_KEY'
    },
    airtable: {
        baseId: 'YOUR_AIRTABLE_BASE_ID',
        apiKey: 'YOUR_AIRTABLE_API_KEY'
    }
};

// Supabase Client (will be loaded from CDN)
let supabaseClient = null;

/**
 * Initialize database connections
 */
async function initDatabase() {
    try {
        // Initialize Supabase client
        if (typeof supabase !== 'undefined' && DB_CONFIG.supabase.url !== 'YOUR_SUPABASE_URL') {
            supabaseClient = supabase.createClient(DB_CONFIG.supabase.url, DB_CONFIG.supabase.anonKey);
            console.log('✅ Supabase connected');
            
            // Create tables if they don't exist (requires admin key in production)
            await createTablesIfNotExists();
            
            return 'supabase';
        } else {
            console.warn('⚠️ Supabase not configured, using local storage');
            return 'local';
        }
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        return 'local';
    }
}

/**
 * Create Supabase tables (run once during setup)
 */
async function createTablesIfNotExists() {
    const tables = [
        `CREATE TABLE IF NOT EXISTS notes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT DEFAULT 'General',
            tags TEXT[] DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            user_id UUID REFERENCES auth.users(id)
        )`,
        `CREATE TABLE IF NOT EXISTS expenses (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            amount DECIMAL NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            date DATE NOT NULL,
            type TEXT CHECK (type IN ('income', 'expense')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            user_id UUID REFERENCES auth.users(id)
        )`,
        `CREATE TABLE IF NOT EXISTS events (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            start_time TIMESTAMP WITH TIME ZONE NOT NULL,
            end_time TIMESTAMP WITH TIME ZONE,
            location TEXT,
            category TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            user_id UUID REFERENCES auth.users(id)
        )`,
        `CREATE TABLE IF NOT EXISTS tasks (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
            priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
            due_date DATE,
            project_id UUID,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            user_id UUID REFERENCES auth.users(id)
        )`,
        `CREATE TABLE IF NOT EXISTS projects (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            user_id UUID REFERENCES auth.users(id)
        )`,
        `CREATE TABLE IF NOT EXISTS files (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT,
            size INTEGER,
            url TEXT,
            storage_path TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            user_id UUID REFERENCES auth.users(id)
        )`,
        `CREATE TABLE IF NOT EXISTS quote_logs (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            quote TEXT NOT NULL,
            author TEXT,
            rating INTEGER CHECK (rating >= 1 AND rating <= 5),
            tags TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            user_id UUID REFERENCES auth.users(id)
        )`
    ];

    // Note: In production, execute these with admin privileges
    console.log('📋 Table schemas ready for deployment');
}

// ==================== NOTES FUNCTIONS ====================

async function saveNoteToDB(title, content, category = 'General', tags = []) {
    if (!supabaseClient) {
        // Fallback to localStorage
        const notes = JSON.parse(localStorage.getItem('aeonflez_notes') || '[]');
        notes.push({ id: Date.now(), title, content, category, tags, createdAt: new Date().toISOString() });
        localStorage.setItem('aeonflez_notes', JSON.stringify(notes));
        return { id: Date.now(), success: true };
    }

    try {
        const { data, error } = await supabaseClient
            .from('notes')
            .insert([
                { 
                    title, 
                    content, 
                    category, 
                    tags,
                    user_id: (await supabaseClient.auth.getUser()).data.user?.id 
                }
            ])
            .select();

        if (error) throw error;
        return { id: data[0].id, success: true };
    } catch (error) {
        console.error('Error saving note:', error);
        return { success: false, error: error.message };
    }
}

async function loadNotesFromDB() {
    if (!supabaseClient) {
        // Fallback to localStorage
        return JSON.parse(localStorage.getItem('aeonflez_notes') || '[]');
    }

    try {
        const userId = (await supabaseClient.auth.getUser()).data.user?.id;
        const { data, error } = await supabaseClient
            .from('notes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading notes:', error);
        return [];
    }
}

async function updateNoteInDB(id, updates) {
    if (!supabaseClient) {
        const notes = JSON.parse(localStorage.getItem('aeonflez_notes') || '[]');
        const index = notes.findIndex(n => n.id === id);
        if (index !== -1) {
            notes[index] = { ...notes[index], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem('aeonflez_notes', JSON.stringify(notes));
            return { success: true };
        }
        return { success: false };
    }

    try {
        const { error } = await supabaseClient
            .from('notes')
            .update({ ...updates, updated_at: new Date() })
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error updating note:', error);
        return { success: false, error: error.message };
    }
}

async function deleteNoteFromDB(id) {
    if (!supabaseClient) {
        const notes = JSON.parse(localStorage.getItem('aeonflez_notes') || '[]');
        const filtered = notes.filter(n => n.id !== id);
        localStorage.setItem('aeonflez_notes', JSON.stringify(filtered));
        return { success: true };
    }

    try {
        const { error } = await supabaseClient
            .from('notes')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting note:', error);
        return { success: false, error: error.message };
    }
}

// ==================== EXPENSES FUNCTIONS ====================

async function saveExpenseToDB(amount, category, description, date, type) {
    if (!supabaseClient) {
        const expenses = JSON.parse(localStorage.getItem('aeonflez_expenses') || '[]');
        expenses.push({ id: Date.now(), amount, category, description, date, type, createdAt: new Date().toISOString() });
        localStorage.setItem('aeonflez_expenses', JSON.stringify(expenses));
        return { id: Date.now(), success: true };
    }

    try {
        const { data, error } = await supabaseClient
            .from('expenses')
            .insert([{ amount, category, description, date, type, user_id: (await supabaseClient.auth.getUser()).data.user?.id }])
            .select();

        if (error) throw error;
        return { id: data[0].id, success: true };
    } catch (error) {
        console.error('Error saving expense:', error);
        return { success: false, error: error.message };
    }
}

async function loadExpensesFromDB() {
    if (!supabaseClient) {
        return JSON.parse(localStorage.getItem('aeonflez_expenses') || '[]');
    }

    try {
        const userId = (await supabaseClient.auth.getUser()).data.user?.id;
        const { data, error } = await supabaseClient
            .from('expenses')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading expenses:', error);
        return [];
    }
}

// ==================== EVENTS/CALENDAR FUNCTIONS ====================

async function saveEventToDB(title, description, startTime, endTime, location, category) {
    if (!supabaseClient) {
        const events = JSON.parse(localStorage.getItem('aeonflez_events') || '[]');
        events.push({ id: Date.now(), title, description, startTime, endTime, location, category, createdAt: new Date().toISOString() });
        localStorage.setItem('aeonflez_events', JSON.stringify(events));
        return { id: Date.now(), success: true };
    }

    try {
        const { data, error } = await supabaseClient
            .from('events')
            .insert([{ title, description, start_time: startTime, end_time: endTime, location, category, user_id: (await supabaseClient.auth.getUser()).data.user?.id }])
            .select();

        if (error) throw error;
        return { id: data[0].id, success: true };
    } catch (error) {
        console.error('Error saving event:', error);
        return { success: false, error: error.message };
    }
}

async function loadEventsFromDB() {
    if (!supabaseClient) {
        return JSON.parse(localStorage.getItem('aeonflez_events') || '[]');
    }

    try {
        const userId = (await supabaseClient.auth.getUser()).data.user?.id;
        const { data, error } = await supabaseClient
            .from('events')
            .select('*')
            .eq('user_id', userId)
            .order('start_time', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading events:', error);
        return [];
    }
}

// ==================== TASKS FUNCTIONS ====================

async function saveTaskToDB(title, description, status, priority, dueDate, projectId) {
    if (!supabaseClient) {
        const tasks = JSON.parse(localStorage.getItem('aeonflez_tasks') || '[]');
        tasks.push({ id: Date.now(), title, description, status, priority, dueDate, projectId, createdAt: new Date().toISOString() });
        localStorage.setItem('aeonflez_tasks', JSON.stringify(tasks));
        return { id: Date.now(), success: true };
    }

    try {
        const { data, error } = await supabaseClient
            .from('tasks')
            .insert([{ title, description, status, priority, due_date: dueDate, project_id: projectId, user_id: (await supabaseClient.auth.getUser()).data.user?.id }])
            .select();

        if (error) throw error;
        return { id: data[0].id, success: true };
    } catch (error) {
        console.error('Error saving task:', error);
        return { success: false, error: error.message };
    }
}

async function loadTasksFromDB() {
    if (!supabaseClient) {
        return JSON.parse(localStorage.getItem('aeonflez_tasks') || '[]');
    }

    try {
        const userId = (await supabaseClient.auth.getUser()).data.user?.id;
        const { data, error } = await supabaseClient
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('due_date', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
}

// ==================== PROJECTS FUNCTIONS ====================

async function saveProjectToDB(name, description, status = 'active') {
    if (!supabaseClient) {
        const projects = JSON.parse(localStorage.getItem('aeonflez_projects') || '[]');
        projects.push({ id: Date.now(), name, description, status, createdAt: new Date().toISOString() });
        localStorage.setItem('aeonflez_projects', JSON.stringify(projects));
        return { id: Date.now(), success: true };
    }

    try {
        const { data, error } = await supabaseClient
            .from('projects')
            .insert([{ name, description, status, user_id: (await supabaseClient.auth.getUser()).data.user?.id }])
            .select();

        if (error) throw error;
        return { id: data[0].id, success: true };
    } catch (error) {
        console.error('Error saving project:', error);
        return { success: false, error: error.message };
    }
}

async function loadProjectsFromDB() {
    if (!supabaseClient) {
        return JSON.parse(localStorage.getItem('aeonflez_projects') || '[]');
    }

    try {
        const userId = (await supabaseClient.auth.getUser()).data.user?.id;
        const { data, error } = await supabaseClient
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

// ==================== FILES FUNCTIONS ====================

async function uploadFileToStorage(file, storagePath = 'files') {
    if (!supabaseClient) {
        // Fallback: store file metadata only
        const files = JSON.parse(localStorage.getItem('aeonflez_files') || '[]');
        files.push({ 
            id: Date.now(), 
            name: file.name, 
            type: file.type, 
            size: file.size,
            createdAt: new Date().toISOString() 
        });
        localStorage.setItem('aeonflez_files', JSON.stringify(files));
        return { id: Date.now(), success: true, message: 'File metadata saved locally' };
    }

    try {
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabaseClient.storage
            .from('aeonflez-files')
            .upload(`${storagePath}/${fileName}`, file);

        if (error) throw error;

        // Save metadata to database
        const publicUrl = supabaseClient.storage.from('aeonflez-files').getPublicUrl(data.path).data.publicUrl;
        
        await supabaseClient
            .from('files')
            .insert([{ 
                name: file.name, 
                type: file.type, 
                size: file.size, 
                url: publicUrl,
                storage_path: data.path,
                user_id: (await supabaseClient.auth.getUser()).data.user?.id 
            }]);

        return { id: fileName, success: true, url: publicUrl };
    } catch (error) {
        console.error('Error uploading file:', error);
        return { success: false, error: error.message };
    }
}

async function loadFilesFromDB() {
    if (!supabaseClient) {
        return JSON.parse(localStorage.getItem('aeonflez_files') || '[]');
    }

    try {
        const userId = (await supabaseClient.auth.getUser()).data.user?.id;
        const { data, error } = await supabaseClient
            .from('files')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading files:', error);
        return [];
    }
}

// ==================== QUOTE LOGS FUNCTIONS ====================

async function saveQuoteLogToDB(quote, author, rating, tags = []) {
    if (!supabaseClient) {
        const logs = JSON.parse(localStorage.getItem('aeonflez_quotes') || '[]');
        logs.push({ id: Date.now(), quote, author, rating, tags, createdAt: new Date().toISOString() });
        localStorage.setItem('aeonflez_quotes', JSON.stringify(logs));
        return { id: Date.now(), success: true };
    }

    try {
        const { data, error } = await supabaseClient
            .from('quote_logs')
            .insert([{ quote, author, rating, tags, user_id: (await supabaseClient.auth.getUser()).data.user?.id }])
            .select();

        if (error) throw error;
        return { id: data[0].id, success: true };
    } catch (error) {
        console.error('Error saving quote log:', error);
        return { success: false, error: error.message };
    }
}

async function loadQuoteLogsFromDB() {
    if (!supabaseClient) {
        return JSON.parse(localStorage.getItem('aeonflez_quotes') || '[]');
    }

    try {
        const userId = (await supabaseClient.auth.getUser()).data.user?.id;
        const { data, error } = await supabaseClient
            .from('quote_logs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading quote logs:', error);
        return [];
    }
}

// ==================== AIRTABLE INTEGRATION ====================

async function syncToAirtable(tableName, records) {
    if (DB_CONFIG.airtable.apiKey === 'YOUR_AIRTABLE_API_KEY') {
        console.warn('Airtable not configured');
        return { success: false, error: 'Airtable not configured' };
    }

    try {
        const response = await fetch(`https://api.airtable.com/v0/${DB_CONFIG.airtable.baseId}/${tableName}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DB_CONFIG.airtable.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                records: records.map(r => ({ fields: r }))
            })
        });

        if (!response.ok) throw new Error('Airtable sync failed');
        return { success: true };
    } catch (error) {
        console.error('Error syncing to Airtable:', error);
        return { success: false, error: error.message };
    }
}

async function loadFromAirtable(tableName) {
    if (DB_CONFIG.airtable.apiKey === 'YOUR_AIRTABLE_API_KEY') {
        return [];
    }

    try {
        const response = await fetch(`https://api.airtable.com/v0/${DB_CONFIG.airtable.baseId}/${tableName}`, {
            headers: {
                'Authorization': `Bearer ${DB_CONFIG.airtable.apiKey}`
            }
        });

        if (!response.ok) throw new Error('Airtable load failed');
        const data = await response.json();
        return data.records.map(r => ({ id: r.id, ...r.fields }));
    } catch (error) {
        console.error('Error loading from Airtable:', error);
        return [];
    }
}

// ==================== AUTHENTICATION ====================

async function signUp(email, password) {
    if (!supabaseClient) {
        alert('Supabase not configured. Please set up your Supabase credentials.');
        return { success: false, error: 'Supabase not configured' };
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({ email, password });
        if (error) throw error;
        return { success: true, user: data.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function signIn(email, password) {
    if (!supabaseClient) {
        alert('Supabase not configured. Please set up your Supabase credentials.');
        return { success: false, error: 'Supabase not configured' };
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return { success: true, user: data.user, session: data.session };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function signOut() {
    if (!supabaseClient) {
        return { success: true };
    }

    try {
        await supabaseClient.auth.signOut();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getCurrentUser() {
    if (!supabaseClient) {
        return null;
    }

    try {
        const { data } = await supabaseClient.auth.getUser();
        return data.user;
    } catch (error) {
        return null;
    }
}

// Export functions for global access
window.AeonFlezDB = {
    initDatabase,
    saveNoteToDB,
    loadNotesFromDB,
    updateNoteInDB,
    deleteNoteFromDB,
    saveExpenseToDB,
    loadExpensesFromDB,
    saveEventToDB,
    loadEventsFromDB,
    saveTaskToDB,
    loadTasksFromDB,
    saveProjectToDB,
    loadProjectsFromDB,
    uploadFileToStorage,
    loadFilesFromDB,
    saveQuoteLogToDB,
    loadQuoteLogsFromDB,
    syncToAirtable,
    loadFromAirtable,
    signUp,
    signIn,
    signOut,
    getCurrentUser
};

console.log('🗄️ AeonFlez Database Service loaded');
