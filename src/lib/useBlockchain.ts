import { useState, useEffect, useCallback } from 'react';
import {
    Project,
    ProjectStatus,
    getAllProjects,
    getProject,
    getProjectsByClient,
    getProjectsByFreelancer,
    getOpenProjects,
    getProjectsByStatus,
    createProject,
    acceptProject,
    submitWork,
    approveWork,
    raiseDispute,
    getAddressStatistics,
    getFreelancerEarnings,
    getClientSpent,
    getClientLockedAmount,
    formatStatus,
    isDeadlinePassed,
    formatTimeRemaining,
    getTimeUntilDeadline,
} from './blockchain';

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const allProjects = await getAllProjects();
            setProjects(allProjects);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch projects');
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { projects, loading, error, refetch: fetchProjects };
}

export function useProject(projectId: number | null) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProject = useCallback(async () => {
        if (!projectId) return;

        setLoading(true);
        setError(null);
        try {
            const proj = await getProject(projectId);
            setProject(proj);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch project');
            console.error('Error fetching project:', err);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    return { project, loading, error, refetch: fetchProject };
}

export function useUserProjects(address: string | null) {
    const [asClient, setAsClient] = useState<Project[]>([]);
    const [asFreelancer, setAsFreelancer] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProjects = useCallback(async () => {
        if (!address) return;

        setLoading(true);
        setError(null);
        try {
            const [clientProjects, freelancerProjects] = await Promise.all([
                getProjectsByClient(address),
                getProjectsByFreelancer(address),
            ]);
            setAsClient(clientProjects);
            setAsFreelancer(freelancerProjects);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch user projects');
            console.error('Error fetching user projects:', err);
        } finally {
            setLoading(false);
        }
    }, [address]);

    useEffect(() => {
        fetchUserProjects();
    }, [fetchUserProjects]);

    return { asClient, asFreelancer, loading, error, refetch: fetchUserProjects };
}

export function useOpenProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOpenProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const openProjects = await getOpenProjects();
            setProjects(openProjects);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch open projects');
            console.error('Error fetching open projects:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOpenProjects();
    }, [fetchOpenProjects]);

    return { projects, loading, error, refetch: fetchOpenProjects };
}

export function useUserStatistics(address: string | null) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        if (!address) return;

        setLoading(true);
        setError(null);
        try {
            const [statistics, earnings, spent, locked] = await Promise.all([
                getAddressStatistics(address),
                getFreelancerEarnings(address),
                getClientSpent(address),
                getClientLockedAmount(address),
            ]);

            setStats({
                ...statistics,
                totalEarnings: earnings,
                totalSpent: spent,
                totalLocked: locked,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch statistics');
            console.error('Error fetching statistics:', err);
        } finally {
            setLoading(false);
        }
    }, [address]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refetch: fetchStats };
}

export function useProjectActions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (description: string, deadline: number, amount: string) => {
        setLoading(true);
        setError(null);
        try {
            const tx = await createProject(description, deadline, amount);
            await tx.wait();
            return tx;
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to create project';
            setError(errorMsg);
            console.error('Error creating project:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const accept = async (projectId: number) => {
        setLoading(true);
        setError(null);
        try {
            const tx = await acceptProject(projectId);
            await tx.wait();
            return tx;
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to accept project';
            setError(errorMsg);
            console.error('Error accepting project:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const submit = async (projectId: number, ipfsHash: string) => {
        setLoading(true);
        setError(null);
        try {
            const tx = await submitWork(projectId, ipfsHash);
            await tx.wait();
            return tx;
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to submit work';
            setError(errorMsg);
            console.error('Error submitting work:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const approve = async (projectId: number) => {
        setLoading(true);
        setError(null);
        try {
            const tx = await approveWork(projectId);
            await tx.wait();
            return tx;
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to approve work';
            setError(errorMsg);
            console.error('Error approving work:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const dispute = async (projectId: number) => {
        setLoading(true);
        setError(null);
        try {
            const tx = await raiseDispute(projectId);
            await tx.wait();
            return tx;
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to raise dispute';
            setError(errorMsg);
            console.error('Error raising dispute:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        create,
        accept,
        submit,
        approve,
        dispute,
        loading,
        error,
    };
}

// Helper hooks for specific project statuses
export function useProjectsByStatus(status: ProjectStatus) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const statusProjects = await getProjectsByStatus(status);
            setProjects(statusProjects);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch projects by status');
            console.error('Error fetching projects by status:', err);
        } finally {
            setLoading(false);
        }
    }, [status]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { projects, loading, error, refetch: fetchProjects };
}

// Export utility functions for use in components
export {
    formatStatus,
    isDeadlinePassed,
    formatTimeRemaining,
    getTimeUntilDeadline,
    ProjectStatus,
};
