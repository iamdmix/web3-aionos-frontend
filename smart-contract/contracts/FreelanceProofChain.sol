// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract FreelanceProofChain {
    // --- State Variables ---
    uint256 private projectCounter;
    uint256[] private projectIds;

    // --- Structs & Enums ---
    enum ProjectStatus {
        Created,
        Accepted,
        WorkSubmitted,
        Approved,
        Disputed
    }

    struct Project {
        uint256 id;
        string description;
        address payable client;
        address payable freelancer;
        uint256 amount;
        uint256 deadline;
        ProjectStatus status;
        string deliverableIPFSHash;
    }

    // --- Mappings ---
    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) private clientProjects;
    mapping(address => uint256[]) private freelancerProjects;

    // --- Events ---
    event ProjectCreated(
        uint256 indexed id,
        address indexed client,
        uint256 amount
    );
    event ProjectAccepted(uint256 indexed id, address indexed freelancer);
    event WorkSubmitted(uint256 indexed id, string ipfsHash);
    event WorkApproved(uint256 indexed id);
    event DisputeRaised(uint256 indexed id);

    // --- Functions ---

    /**
     * @notice Allows a client to create a new project and lock funds in escrow.
     */
    function createProject(
        string memory _description,
        uint256 _deadline
    ) public payable {
        require(msg.value > 0, "Amount must be greater than zero.");
        require(_deadline > block.timestamp, "Deadline must be in the future.");

        projectCounter++;
        projects[projectCounter] = Project({
            id: projectCounter,
            description: _description,
            client: payable(msg.sender),
            freelancer: payable(address(0)),
            amount: msg.value,
            deadline: _deadline,
            status: ProjectStatus.Created,
            deliverableIPFSHash: ""
        });

        projectIds.push(projectCounter);
        clientProjects[msg.sender].push(projectCounter);

        emit ProjectCreated(projectCounter, msg.sender, msg.value);
    }

    /**
     * @notice Allows a freelancer to accept an open project.
     */
    function acceptProject(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(project.id != 0, "Project does not exist.");
        require(
            project.status == ProjectStatus.Created,
            "Project is not open for acceptance."
        );
        require(
            msg.sender != project.client,
            "Client cannot accept their own project."
        );

        project.freelancer = payable(msg.sender);
        project.status = ProjectStatus.Accepted;
        freelancerProjects[msg.sender].push(_projectId);

        emit ProjectAccepted(_projectId, msg.sender);
    }

    /**
     * @notice Allows the assigned freelancer to submit their work.
     */
    function submitWork(uint256 _projectId, string memory _ipfsHash) public {
        Project storage project = projects[_projectId];
        require(
            project.status == ProjectStatus.Accepted,
            "Work cannot be submitted at this stage."
        );
        require(
            msg.sender == project.freelancer,
            "Only the assigned freelancer can submit work."
        );

        project.deliverableIPFSHash = _ipfsHash;
        project.status = ProjectStatus.WorkSubmitted;
        emit WorkSubmitted(_projectId, _ipfsHash);
    }

    /**
     * @notice Allows the client to approve submitted work and release funds.
     */
    function approveWork(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(
            project.status == ProjectStatus.WorkSubmitted,
            "Work cannot be approved at this stage."
        );
        require(
            msg.sender == project.client,
            "Only the client can approve work."
        );

        project.status = ProjectStatus.Approved;
        (bool success, ) = project.freelancer.call{value: project.amount}("");
        require(success, "Failed to transfer funds.");

        emit WorkApproved(_projectId);
    }

    /**
     * @notice Allows either the client or freelancer to raise a dispute.
     */
    function raiseDispute(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(project.id != 0, "Project does not exist.");
        require(
            msg.sender == project.client || msg.sender == project.freelancer,
            "Only client or freelancer can dispute."
        );
        require(
            project.status != ProjectStatus.Approved &&
                project.status != ProjectStatus.Disputed,
            "Project cannot be disputed at this stage."
        );

        project.status = ProjectStatus.Disputed;
        emit DisputeRaised(_projectId);
    }

    // --- View Functions ---

    /**
     * @notice Returns the total number of projects created.
     */
    function getProjectCount() public view returns (uint256) {
        return projectCounter;
    }

    /**
     * @notice Returns all project IDs.
     */
    function getAllProjectIds() public view returns (uint256[] memory) {
        return projectIds;
    }

    /**
     * @notice Returns all projects (WARNING: May be gas-intensive for large datasets).
     */
    function getAllProjects() public view returns (Project[] memory) {
        Project[] memory allProjects = new Project[](projectIds.length);
        for (uint256 i = 0; i < projectIds.length; i++) {
            allProjects[i] = projects[projectIds[i]];
        }
        return allProjects;
    }

    /**
     * @notice Returns projects in a specific range (for pagination).
     */
    function getProjectsInRange(
        uint256 _start,
        uint256 _end
    ) public view returns (Project[] memory) {
        require(_start < _end, "Invalid range.");
        require(_end <= projectIds.length, "End index out of bounds.");

        uint256 length = _end - _start;
        Project[] memory rangeProjects = new Project[](length);

        for (uint256 i = 0; i < length; i++) {
            rangeProjects[i] = projects[projectIds[_start + i]];
        }

        return rangeProjects;
    }

    /**
     * @notice Returns all project IDs created by a specific client.
     */
    function getClientProjectIds(
        address _client
    ) public view returns (uint256[] memory) {
        return clientProjects[_client];
    }

    /**
     * @notice Returns all projects created by a specific client.
     */
    function getClientProjects(
        address _client
    ) public view returns (Project[] memory) {
        uint256[] memory ids = clientProjects[_client];
        Project[] memory clientProjectList = new Project[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            clientProjectList[i] = projects[ids[i]];
        }

        return clientProjectList;
    }

    /**
     * @notice Returns all project IDs accepted by a specific freelancer.
     */
    function getFreelancerProjectIds(
        address _freelancer
    ) public view returns (uint256[] memory) {
        return freelancerProjects[_freelancer];
    }

    /**
     * @notice Returns all projects accepted by a specific freelancer.
     */
    function getFreelancerProjects(
        address _freelancer
    ) public view returns (Project[] memory) {
        uint256[] memory ids = freelancerProjects[_freelancer];
        Project[] memory freelancerProjectList = new Project[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            freelancerProjectList[i] = projects[ids[i]];
        }

        return freelancerProjectList;
    }

    /**
     * @notice Returns all open projects (status = Created).
     */
    function getOpenProjects() public view returns (Project[] memory) {
        uint256 openCount = 0;

        // First pass: count open projects
        for (uint256 i = 0; i < projectIds.length; i++) {
            if (projects[projectIds[i]].status == ProjectStatus.Created) {
                openCount++;
            }
        }

        // Second pass: populate array
        Project[] memory openProjects = new Project[](openCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < projectIds.length; i++) {
            if (projects[projectIds[i]].status == ProjectStatus.Created) {
                openProjects[currentIndex] = projects[projectIds[i]];
                currentIndex++;
            }
        }

        return openProjects;
    }

    /**
     * @notice Returns projects by status.
     */
    function getProjectsByStatus(
        ProjectStatus _status
    ) public view returns (Project[] memory) {
        uint256 count = 0;

        // First pass: count projects with given status
        for (uint256 i = 0; i < projectIds.length; i++) {
            if (projects[projectIds[i]].status == _status) {
                count++;
            }
        }

        // Second pass: populate array
        Project[] memory statusProjects = new Project[](count);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < projectIds.length; i++) {
            if (projects[projectIds[i]].status == _status) {
                statusProjects[currentIndex] = projects[projectIds[i]];
                currentIndex++;
            }
        }

        return statusProjects;
    }

    /**
     * @notice Returns multiple projects by their IDs.
     */
    function getProjectsByIds(
        uint256[] memory _projectIds
    ) public view returns (Project[] memory) {
        Project[] memory requestedProjects = new Project[](_projectIds.length);

        for (uint256 i = 0; i < _projectIds.length; i++) {
            require(
                projects[_projectIds[i]].id != 0,
                "Project does not exist."
            );
            requestedProjects[i] = projects[_projectIds[i]];
        }

        return requestedProjects;
    }

    /**
     * @notice Checks if a project exists.
     */
    function projectExists(uint256 _projectId) public view returns (bool) {
        return projects[_projectId].id != 0;
    }

    /**
     * @notice Returns statistics for a specific address.
     */
    function getAddressStatistics(
        address _address
    )
        public
        view
        returns (
            uint256 totalAsClient,
            uint256 totalAsFreelancer,
            uint256 completedAsClient,
            uint256 completedAsFreelancer,
            uint256 totalSpentAsClient,
            uint256 totalEarnedAsFreelancer
        )
    {
        uint256[] memory clientIds = clientProjects[_address];
        uint256[] memory freelancerIds = freelancerProjects[_address];

        totalAsClient = clientIds.length;
        totalAsFreelancer = freelancerIds.length;

        // Calculate client statistics
        for (uint256 i = 0; i < clientIds.length; i++) {
            Project memory proj = projects[clientIds[i]];
            if (proj.status == ProjectStatus.Approved) {
                completedAsClient++;
                totalSpentAsClient += proj.amount;
            }
        }

        // Calculate freelancer statistics
        for (uint256 i = 0; i < freelancerIds.length; i++) {
            Project memory proj = projects[freelancerIds[i]];
            if (proj.status == ProjectStatus.Approved) {
                completedAsFreelancer++;
                totalEarnedAsFreelancer += proj.amount;
            }
        }

        return (
            totalAsClient,
            totalAsFreelancer,
            completedAsClient,
            completedAsFreelancer,
            totalSpentAsClient,
            totalEarnedAsFreelancer
        );
    }

    /**
     * @notice Returns the contract's total value locked (TVL).
     */
    function getTotalValueLocked() public view returns (uint256) {
        return address(this).balance;
    }
}
