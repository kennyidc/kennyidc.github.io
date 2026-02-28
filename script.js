// 全局变量
let currentUser = null;
let userData = [];
let questionData = [];
let testData = null;
let currentQuestions = [];
let currentAnswers = {};
let currentQuestionIndex = 0;
let currentSheetName = "";
let currentTimeLimit = 0;
let countdownTimer = null;
let userAnswersData = [];
const ADMIN_USERNAME = "silvia";
const ADMIN_PASSWORD = "527070";

// 初始化用户数据
function initUserData() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        userData = JSON.parse(storedUsers);
    } else {
        // 初始化空用户数据
        userData = [];
        saveUserData();
    }
}

// 保存用户数据到本地存储
function saveUserData() {
    localStorage.setItem('users', JSON.stringify(userData));
}

// 初始化习题数据
function initQuestionData() {
    const storedQuestions = localStorage.getItem('questions');
    if (storedQuestions) {
        questionData = JSON.parse(storedQuestions);
    } else {
        // 初始化空习题数据
        questionData = [];
        saveQuestionData();
    }
}

// 保存习题数据到本地存储
function saveQuestionData() {
    localStorage.setItem('questions', JSON.stringify(questionData));
}

// 初始化用户答案数据
function initUserAnswers() {
    const storedAnswers = localStorage.getItem('userAnswers');
    if (storedAnswers) {
        userAnswersData = JSON.parse(storedAnswers);
    } else {
        // 初始化空用户答案数据
        userAnswersData = [];
        saveUserAnswers();
    }
}

// 保存用户答案数据到本地存储
function saveUserAnswers() {
    localStorage.setItem('userAnswers', JSON.stringify(userAnswersData));
}

// 初始化邮箱配置数据
function initEmailConfig() {
    const storedConfig = localStorage.getItem('emailConfig');
    if (storedConfig) {
        return JSON.parse(storedConfig);
    } else {
        // 返回默认配置
        return {
            smtpServer: 'smtp.qq.com',
            smtpPort: 587,
            emailUsername: '',
            emailPassword: '',
            recipientEmail: '1585088657@QQ.COM'
        };
    }
}

// 保存邮箱配置到本地存储
function saveEmailConfig(config) {
    localStorage.setItem('emailConfig', JSON.stringify(config));
}

// DOM元素
const loginPage = document.getElementById('login-page');
const testPage = document.getElementById('test-page');
const resultPage = document.getElementById('result-page');
const userManagementPage = document.getElementById('user-management-page');
const questionManagementPage = document.getElementById('question-management-page');
const emailConfigPage = document.getElementById('email-config-page');
const guidePage = document.getElementById('guide-page');
const timedQuestionPage = document.getElementById('timed-question-page');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const loginMessage = document.getElementById('login-message');
const currentUserElement = document.getElementById('current-user');
const logoutBtn = document.getElementById('logout-btn');
const userManagementBtn = document.getElementById('user-management-btn');
const questionManagementBtn = document.getElementById('question-management-btn');
const emailConfigBtn = document.getElementById('email-config-btn');
const backToTestBtnFromManagement = document.getElementById('back-to-test-btn-from-management');
const backToTestBtnFromQuestionManagement = document.getElementById('back-to-test-btn-from-question-management');
const backToTestBtnFromEmailConfig = document.getElementById('back-to-test-btn-from-email-config');
const newUsernameInput = document.getElementById('new-username');
const newPasswordInput = document.getElementById('new-password');
const newRemarkInput = document.getElementById('new-remark');
const addUserBtn = document.getElementById('add-user-btn');
const addUserMessage = document.getElementById('add-user-message');
const userListContainer = document.getElementById('user-list-container');
const questionIdInput = document.getElementById('question-id');
const questionPeriodInput = document.getElementById('question-period');
const questionContentInput = document.getElementById('question-content');
const questionTypeSelect = document.getElementById('question-type');
const optionAInput = document.getElementById('option-a');
const optionBInput = document.getElementById('option-b');
const optionCInput = document.getElementById('option-c');
const optionDInput = document.getElementById('option-d');
const questionAudioFileInput = document.getElementById('question-audio-file');
const questionTimeLimitInput = document.getElementById('question-time-limit');
const addQuestionBtn = document.getElementById('add-question-btn');
const addQuestionMessage = document.getElementById('add-question-message');
const questionPeriodSelect = document.getElementById('question-period-select');
const questionListContainer = document.getElementById('question-list-container');
const importFileInput = document.getElementById('import-file');
const importAudioFilesInput = document.getElementById('import-audio-files');
const importQuestionBtn = document.getElementById('import-question-btn');
const importQuestionMessage = document.getElementById('import-question-message');
const smtpServerInput = document.getElementById('smtp-server');
const smtpPortInput = document.getElementById('smtp-port');
const emailUsernameInput = document.getElementById('email-username');
const emailPasswordInput = document.getElementById('email-password');
const recipientEmailInput = document.getElementById('recipient-email');
const saveEmailConfigBtn = document.getElementById('save-email-config-btn');
const emailConfigMessage = document.getElementById('email-config-message');
const testFileInput = document.getElementById('test-file');
const sheetNameSelect = document.getElementById('sheet-name');
const startTestBtn = document.getElementById('start-test-btn');
const questionContainer = document.getElementById('question-container');
const questionTitle = document.getElementById('question-title');
const questionContent = document.getElementById('question-content');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const guideContent = document.getElementById('guide-content');
const iKnowBtn = document.getElementById('i-know-btn');
const timedQuestionContent = document.getElementById('timed-question-content');
const countdownElement = document.getElementById('countdown');
const submitTimedQuestionBtn = document.getElementById('submit-timed-question-btn');
const resultContent = document.getElementById('result-content');
const emailStatusMessage = document.getElementById('email-status-message');
const exportBtn = document.getElementById('export-btn');
const retryUploadBtn = document.getElementById('retry-upload-btn');
const backToTestBtn = document.getElementById('back-to-test-btn');
const dataManagementBtn = document.getElementById('data-management-btn');
const dataManagementPage = document.getElementById('data-management-page');
const backToTestBtnFromDataManagement = document.getElementById('back-to-test-btn-from-data-management');
const exportAllDataBtn = document.getElementById('export-all-data-btn');
const exportDataMessage = document.getElementById('export-data-message');
const importAllDataFile = document.getElementById('import-all-data-file');
const importAllDataBtn = document.getElementById('import-all-data-btn');
const importDataMessage = document.getElementById('import-data-message');

// 从初始数据文件加载数据
function loadInitialData() {
    fetch('initial_data.json')
        .then(response => response.json())
        .then(data => {
            // 检查localStorage中是否已有数据
            const hasUsers = localStorage.getItem('users');
            const hasQuestions = localStorage.getItem('questions');
            
            // 如果localStorage中没有数据，从初始数据文件加载
            if (!hasUsers || !hasQuestions) {
                if (data.users) {
                    userData = data.users;
                    saveUserData();
                }
                if (data.questions) {
                    questionData = data.questions;
                    saveQuestionData();
                }
                if (data.audioFiles) {
                    localStorage.setItem('audioFiles', JSON.stringify(data.audioFiles));
                }
                if (data.emailConfig) {
                    saveEmailConfig(data.emailConfig);
                }
            }
        })
        .catch(error => {
            console.log('No initial data file found, using empty data');
        });
}

// 页面加载时初始化
window.onload = function() {
    initUserData();
    initQuestionData();
    initUserAnswers();
    loadInitialData();
};

// 登录功能
loginBtn.addEventListener('click', function() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        showLoginMessage('请填写所有字段', 'error');
        return;
    }

    // 验证管理员登录
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        currentUser = { username: ADMIN_USERNAME, isAdmin: true };
        showTestPage();
        return;
    }

    // 验证普通用户登录
    const user = userData.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        showTestPage();
    } else {
        showLoginMessage('用户名或密码错误', 'error');
    }
});

// 显示测试页面
function showTestPage() {
    currentUserElement.textContent = currentUser.username;
    
    // 检查是否为管理员，显示或隐藏管理按钮
    if (currentUser.isAdmin) {
        userManagementBtn.style.display = 'inline-block';
        questionManagementBtn.style.display = 'inline-block';
        emailConfigBtn.style.display = 'inline-block';
        dataManagementBtn.style.display = 'inline-block';
    } else {
        userManagementBtn.style.display = 'none';
        questionManagementBtn.style.display = 'none';
        emailConfigBtn.style.display = 'none';
        dataManagementBtn.style.display = 'none';
    }
    
    // 重新初始化期数选择
    updateTestForm();
    
    loginPage.classList.remove('active');
    testPage.classList.add('active');
    resultPage.classList.remove('active');
    userManagementPage.classList.remove('active');
    questionManagementPage.classList.remove('active');
    emailConfigPage.classList.remove('active');
    timedQuestionPage.classList.remove('active');
    setTimeout(() => {
        loginPage.style.display = 'none';
        testPage.style.display = 'block';
        resultPage.style.display = 'none';
        userManagementPage.style.display = 'none';
        questionManagementPage.style.display = 'none';
        emailConfigPage.style.display = 'none';
        timedQuestionPage.style.display = 'none';
    }, 500);
}

// 退出登录
logoutBtn.addEventListener('click', function() {
    currentUser = null;
    testData = null;
    currentQuestions = [];
    currentAnswers = {};
    currentQuestionIndex = 0;
    currentSheetName = "";
    currentTimeLimit = 0;
    
    // 清除计时器
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
    
    usernameInput.value = "";
    passwordInput.value = "";
    testFileInput.value = "";
    sheetNameSelect.innerHTML = "";
    loginPage.classList.add('active');
    testPage.classList.remove('active');
    resultPage.classList.remove('active');
    userManagementPage.classList.remove('active');
    questionManagementPage.classList.remove('active');
    emailConfigPage.classList.remove('active');
    dataManagementPage.classList.remove('active');
    timedQuestionPage.classList.remove('active');
    setTimeout(() => {
        loginPage.style.display = 'block';
        testPage.style.display = 'none';
        resultPage.style.display = 'none';
        userManagementPage.style.display = 'none';
        questionManagementPage.style.display = 'none';
        emailConfigPage.style.display = 'none';
        dataManagementPage.style.display = 'none';
        timedQuestionPage.style.display = 'none';
    }, 500);
});

// 初始化期数选择
function initPeriodSelect() {
    // 获取所有唯一的期数
    const periods = [...new Set(questionData.map(q => q.period))].sort((a, b) => a - b);
    
    sheetNameSelect.innerHTML = "";
    periods.forEach(period => {
        const option = document.createElement('option');
        option.value = period;
        option.textContent = `第${period}期`;
        sheetNameSelect.appendChild(option);
    });
}

// 测试期数选择变化时的处理
function updateTestForm() {
    initPeriodSelect();
}

// 页面加载时更新测试表单
updateTestForm();

// 开始测试
startTestBtn.addEventListener('click', function() {
    const selectedPeriod = parseInt(sheetNameSelect.value);
    
    if (isNaN(selectedPeriod)) {
        alert('请选择测试期数');
        return;
    }

    // 从本地存储中获取对应期数的习题
    currentQuestions = questionData.filter(q => q.period === selectedPeriod);
    
    if (currentQuestions.length === 0) {
        alert('该期数暂无习题');
        return;
    }

    // 按题型顺序排序：单选题 -> 多选题 -> 拼写填空题
    const typeOrder = { 'single': 1, 'multiple': 2, 'fill': 3 };
    currentQuestions.sort((a, b) => {
        if (typeOrder[a.type] !== typeOrder[b.type]) {
            return typeOrder[a.type] - typeOrder[b.type];
        }
        return (a.id || 0) - (b.id || 0);
    });

    currentSheetName = `第${selectedPeriod}期`;
    currentAnswers = {};
    currentQuestionIndex = 0;

    // 开始测试，检查第一题是否有时限
    showNextQuestion();
});

// 显示下一题
function showNextQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        // 测试完成
        showResultPage();
        return;
    }

    const question = currentQuestions[currentQuestionIndex];
    
    // 检查是否需要显示引导页面（只有当题型发生变化时才显示）
    let needGuide = true;
    if (currentQuestionIndex > 0) {
        const previousQuestion = currentQuestions[currentQuestionIndex - 1];
        if (previousQuestion.type === question.type) {
            needGuide = false;
        }
    }
    
    if (needGuide) {
        // 显示答题引导页面
        showGuidePage(question);
    } else {
        // 直接显示问题页面
        if (question.timeLimit && question.timeLimit > 0) {
            // 显示限时习题页面
            showTimedQuestionPage(question);
        } else {
            // 显示普通习题页面
            showQuestion(currentQuestionIndex);
            questionContainer.style.display = 'block';
        }
    }
}

// 显示答题引导页面
function showGuidePage(question) {
    guidePage.classList.add('active');
    testPage.classList.remove('active');
    timedQuestionPage.classList.remove('active');
    setTimeout(() => {
        testPage.style.display = 'none';
        timedQuestionPage.style.display = 'none';
        guidePage.style.display = 'block';
        
        // 根据题型显示不同的引导内容
        let guideHTML = '';
        switch (question.type) {
            case 'single':
                guideHTML = `
                    <h3>单选题（二选一）</h3>
                    <p>答题方式：</p>
                    <ul>
                        <li>从A、B两个选项中选择一个正确答案</li>
                        <li>点击选项即可完成选择</li>
                    </ul>
                    <p>注意事项：</p>
                    <ul>
                        <li>本题目有时限要求，请在规定时间内完成答题</li>
                        <li>时限结束后将自动进入下一题，无论是否答题</li>
                        <li>时限：${question.timeLimit}秒</li>
                    </ul>
                `;
                break;
            case 'multiple':
                guideHTML = `
                    <h3>多选题（四选1-4）</h3>
                    <p>答题方式：</p>
                    <ul>
                        <li>从A、B、C、D四个选项中选择一个或多个正确答案</li>
                        <li>点击选项即可完成选择，可多选</li>
                    </ul>
                    <p>注意事项：</p>
                    <ul>
                        <li>本题目有时限要求，请在规定时间内完成答题</li>
                        <li>时限结束后将自动进入下一题，无论是否答题</li>
                        <li>时限：${question.timeLimit}秒</li>
                        ${question.audio ? '<li>进入题目后会自动播放音频，请仔细听</li>' : ''}
                    </ul>
                `;
                break;
            case 'fill':
                guideHTML = `
                    <h3>拼写填空题</h3>
                    <p>答题方式：</p>
                    <ul>
                        <li>系统会自动播放音频</li>
                        <li>仔细听音频内容</li>
                        <li>在下方输入框中填写所听到的单词</li>
                    </ul>
                    <p>注意事项：</p>
                    <ul>
                        <li>本题目有时限要求，请在规定时间内完成答题</li>
                        <li>时限结束后将自动进入下一题，无论是否答题</li>
                        <li>时限：${question.timeLimit}秒</li>
                        <li>进入题目后会自动播放音频，请仔细听</li>
                    </ul>
                `;
                break;
        }
        
        guideContent.innerHTML = guideHTML;
    }, 500);
}

// 我知道了按钮点击事件
iKnowBtn.addEventListener('click', function() {
    const question = currentQuestions[currentQuestionIndex];
    
    // 隐藏引导页面，显示对应问题页面
    guidePage.classList.remove('active');
    
    // 检查是否有时限（所有习题都有时限要求）
    if (question.timeLimit && question.timeLimit > 0) {
        // 显示限时习题页面
        showTimedQuestionPage(question);
    } else {
        // 显示普通习题页面
        showQuestion(currentQuestionIndex);
        questionContainer.style.display = 'block';
    }
});

// 显示问题
function showQuestion(index) {
    if (index < 0 || index >= currentQuestions.length) return;

    const question = currentQuestions[index];
    questionTitle.textContent = `问题 ${question.id} (${index + 1}/${currentQuestions.length})`;
    questionContent.innerHTML = ``;

    // 显示问题内容
    const questionText = document.createElement('div');
    questionText.innerHTML = `<p>${question.content}</p>`;
    questionContent.appendChild(questionText);

    // 处理音频（仅为单选题和多选题）
    if (question.audio && (question.type === 'single' || question.type === 'multiple')) {
        const audioContainer = document.createElement('div');
        audioContainer.id = 'audio-player';
        // 多选题自动播放音频
        const autoPlay = question.type === 'multiple' ? 'autoplay' : '';
        audioContainer.innerHTML = `<audio controls ${autoPlay}><source src="${question.audio}" type="audio/mpeg">您的浏览器不支持音频播放</audio>`;
        questionContent.appendChild(audioContainer);
    }

    // 根据题型显示不同的选项
    if (question.type === 'single') {
        // 单选题（二选一）
        ['A', 'B'].forEach(option => {
            if (question[`option${option}`]) {
                const optionElement = document.createElement('div');
                optionElement.className = 'question-option';
                optionElement.dataset.option = option;
                optionElement.innerHTML = `${option}. ${question[`option${option}`]}`;
                
                if (currentAnswers[index] === option) {
                    optionElement.classList.add('selected');
                }
                
                optionElement.addEventListener('click', function() {
                    document.querySelectorAll('.question-option').forEach(el => el.classList.remove('selected'));
                    this.classList.add('selected');
                    currentAnswers[index] = option;
                });
                
                questionContent.appendChild(optionElement);
            }
        });
    } else if (question.type === 'multiple') {
        // 多选题（四选1至4）
        ['A', 'B', 'C', 'D'].forEach(option => {
            if (question[`option${option}`]) {
                const optionElement = document.createElement('div');
                optionElement.className = 'question-option';
                optionElement.dataset.option = option;
                optionElement.innerHTML = `${option}. ${question[`option${option}`]}`;
                
                if (currentAnswers[index] && currentAnswers[index].includes(option)) {
                    optionElement.classList.add('selected');
                }
                
                optionElement.addEventListener('click', function() {
                    if (!currentAnswers[index]) {
                        currentAnswers[index] = [];
                    }
                    
                    const optionIndex = currentAnswers[index].indexOf(option);
                    if (optionIndex > -1) {
                        currentAnswers[index].splice(optionIndex, 1);
                        this.classList.remove('selected');
                    } else {
                        currentAnswers[index].push(option);
                        this.classList.add('selected');
                    }
                });
                
                questionContent.appendChild(optionElement);
            }
        });
    } else if (question.type === 'fill') {
        // 拼写填空题（听音频写单词）
        const fillContainer = document.createElement('div');
        fillContainer.className = 'fill-blank';
        
        // 显示题目内容
        fillContainer.innerHTML = `<p>${question.content}</p>`;
        
        // 处理音频
        if (question.audio) {
            const audioContainer = document.createElement('div');
            audioContainer.id = 'audio-player';
            audioContainer.innerHTML = `<audio controls autoplay><source src="${question.audio}" type="audio/mpeg">您的浏览器不支持音频播放</audio>`;
            fillContainer.appendChild(audioContainer);
        }
        
        // 在习题下方添加输入框
        const inputContainer = document.createElement('div');
        inputContainer.className = 'fill-input-container';
        inputContainer.innerHTML = '<h4>请在下方输入您听到的单词：</h4>';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'fill-input';
        input.dataset.index = 0;
        input.placeholder = '请输入答案';
        
        if (currentAnswers[index] && currentAnswers[index][0]) {
            input.value = currentAnswers[index][0];
        }
        
        input.addEventListener('input', function() {
            if (!currentAnswers[index]) {
                currentAnswers[index] = [];
            }
            currentAnswers[index][this.dataset.index] = this.value;
        });
        
        inputContainer.appendChild(input);
        
        questionContent.appendChild(fillContainer);
        questionContent.appendChild(inputContainer);
    }

    // 更新按钮状态
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === currentQuestions.length - 1;
}

// 上一题
prevBtn.addEventListener('click', function() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
});

// 下一题
nextBtn.addEventListener('click', function() {
    currentQuestionIndex++;
    showNextQuestion();
});

// 提交试卷
submitBtn.addEventListener('click', function() {
    showResultPage();
});

// 显示限时习题页面
function showTimedQuestionPage(question) {
    timedQuestionPage.classList.add('active');
    testPage.classList.remove('active');
    setTimeout(() => {
        testPage.style.display = 'none';
        timedQuestionPage.style.display = 'block';
        
        // 显示问题内容
        timedQuestionContent.innerHTML = ``;
        
        // 只为单选题和多选题显示问题标题
        if (question.type === 'single' || question.type === 'multiple') {
            const questionText = document.createElement('div');
            questionText.innerHTML = `<h3>问题 ${question.id} (${currentQuestionIndex + 1}/${currentQuestions.length})</h3><p>${question.content}</p>`;
            timedQuestionContent.appendChild(questionText);
        }
        
        // 处理音频（仅为单选题和多选题）
        if (question.audio && (question.type === 'single' || question.type === 'multiple')) {
            const audioContainer = document.createElement('div');
            audioContainer.id = 'audio-player';
            // 多选题自动播放音频
            const autoPlay = question.type === 'multiple' ? 'autoplay' : '';
            audioContainer.innerHTML = `<audio controls ${autoPlay}><source src="${question.audio}" type="audio/mpeg">您的浏览器不支持音频播放</audio>`;
            timedQuestionContent.appendChild(audioContainer);
        }
        
        // 根据题型显示不同的选项
        if (question.type === 'single') {
            // 单选题（二选一）
            ['A', 'B'].forEach(option => {
                if (question[`option${option}`]) {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'question-option';
                    optionElement.dataset.option = option;
                    optionElement.innerHTML = `${option}. ${question[`option${option}`]}`;
                    
                    if (currentAnswers[currentQuestionIndex] === option) {
                        optionElement.classList.add('selected');
                    }
                    
                    optionElement.addEventListener('click', function() {
                        document.querySelectorAll('.question-option').forEach(el => el.classList.remove('selected'));
                        this.classList.add('selected');
                        currentAnswers[currentQuestionIndex] = option;
                    });
                    
                    timedQuestionContent.appendChild(optionElement);
                }
            });
        } else if (question.type === 'multiple') {
            // 多选题（四选1至4）
            ['A', 'B', 'C', 'D'].forEach(option => {
                if (question[`option${option}`]) {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'question-option';
                    optionElement.dataset.option = option;
                    optionElement.innerHTML = `${option}. ${question[`option${option}`]}`;
                    
                    if (currentAnswers[currentQuestionIndex] && currentAnswers[currentQuestionIndex].includes(option)) {
                        optionElement.classList.add('selected');
                    }
                    
                    optionElement.addEventListener('click', function() {
                        if (!currentAnswers[currentQuestionIndex]) {
                            currentAnswers[currentQuestionIndex] = [];
                        }
                        
                        const optionIndex = currentAnswers[currentQuestionIndex].indexOf(option);
                        if (optionIndex > -1) {
                            currentAnswers[currentQuestionIndex].splice(optionIndex, 1);
                            this.classList.remove('selected');
                        } else {
                            currentAnswers[currentQuestionIndex].push(option);
                            this.classList.add('selected');
                        }
                    });
                    
                    timedQuestionContent.appendChild(optionElement);
                }
            });
        } else if (question.type === 'fill') {
            // 拼写填空题（听音频写单词）
            const fillContainer = document.createElement('div');
            fillContainer.className = 'fill-blank';
            
            // 显示题目内容
            fillContainer.innerHTML = `<h3>问题 ${question.id} (${currentQuestionIndex + 1}/${currentQuestions.length})</h3><p>${question.content}</p>`;
            
            // 处理音频
            if (question.audio) {
                const audioContainer = document.createElement('div');
                audioContainer.id = 'audio-player';
                audioContainer.innerHTML = `<audio controls autoplay><source src="${question.audio}" type="audio/mpeg">您的浏览器不支持音频播放</audio>`;
                fillContainer.appendChild(audioContainer);
            }
            
            // 在习题下方添加输入框
            const inputContainer = document.createElement('div');
            inputContainer.className = 'fill-input-container';
            inputContainer.innerHTML = '<h4>请在下方输入您听到的单词：</h4>';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'fill-input';
            input.dataset.index = 0;
            input.placeholder = '请输入答案';
            
            if (currentAnswers[currentQuestionIndex] && currentAnswers[currentQuestionIndex][0]) {
                input.value = currentAnswers[currentQuestionIndex][0];
            }
            
            input.addEventListener('input', function() {
                if (!currentAnswers[currentQuestionIndex]) {
                    currentAnswers[currentQuestionIndex] = [];
                }
                currentAnswers[currentQuestionIndex][this.dataset.index] = this.value;
            });
            
            inputContainer.appendChild(input);
            
            timedQuestionContent.appendChild(fillContainer);
            timedQuestionContent.appendChild(inputContainer);
        }
        
        // 启动倒计时
        startCountdown(question.timeLimit);
    }, 500);
}

// 启动倒计时
function startCountdown(seconds) {
    let remainingTime = seconds;
    countdownElement.textContent = remainingTime;
    
    // 清除之前的计时器
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }
    
    // 启动新的计时器
    countdownTimer = setInterval(() => {
        remainingTime--;
        countdownElement.textContent = remainingTime;
        
        if (remainingTime <= 0) {
            clearInterval(countdownTimer);
            countdownTimer = null;
            // 时间到，自动提交
            submitTimedQuestion();
        }
    }, 1000);
}

// 提交限时习题
function submitTimedQuestion() {
    // 清除计时器
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
    
    // 进入下一题
    currentQuestionIndex++;
    showNextQuestion();
}

// 提交限时习题按钮点击事件
submitTimedQuestionBtn.addEventListener('click', function() {
    submitTimedQuestion();
});

// 显示结果页面
function showResultPage() {
    testPage.classList.remove('active');
    resultPage.classList.add('active');
    setTimeout(() => {
        testPage.style.display = 'none';
        resultPage.style.display = 'block';
        
        // 生成结果
        let resultHTML = `<h3>测试结果 - ${currentSheetName}</h3>`;
        resultHTML += `<p>学生：${currentUser.username}</p>`;
        resultHTML += `<p>测试时间：${new Date().toLocaleString()}</p>`;
        resultHTML += '<h4>答题情况：</h4>';
        
        currentQuestions.forEach((question, index) => {
            const answer = currentAnswers[index];
            let answerText = '';
            
            if (question.type === 'single' || question.type === 'multiple') {
                if (Array.isArray(answer)) {
                    answerText = answer.join(', ');
                } else {
                    answerText = answer || '未作答';
                }
            } else if (question.type === 'fill') {
                answerText = answer ? answer.join(', ') : '未作答';
            }
            
            resultHTML += `<div class="result-item">
                <p><strong>问题 ${index + 1}：</strong>${question.content}</p>
                <p><strong>答案：</strong>${answerText}</p>
            </div>`;
        });
        
        resultContent.innerHTML = resultHTML;
        
        // 保存用户答案
        saveUserAnswer();
    }, 500);
}

// 保存用户答案
function saveUserAnswer() {
    const userAnswer = {
        userId: currentUser.id,
        username: currentUser.username,
        testPeriod: currentSheetName,
        testTime: new Date().toISOString(),
        answers: []
    };
    
    currentQuestions.forEach((question, index) => {
        const answer = currentAnswers[index];
        let answerText = '';
        
        if (question.type === 'single' || question.type === 'multiple') {
            if (Array.isArray(answer)) {
                answerText = answer.join(', ');
            } else {
                answerText = answer || '未作答';
            }
        } else if (question.type === 'fill') {
            answerText = answer ? answer.join(', ') : '未作答';
        }
        
        userAnswer.answers.push({
            questionId: question.id,
            questionContent: question.content,
            questionType: question.type,
            answer: answerText
        });
    });
    
    userAnswersData.push(userAnswer);
    saveUserAnswers();
}

// 发送邮件
function sendEmail() {
    // 准备邮件内容
    let emailContent = `学生：${currentUser.username}\n`;
    emailContent += `测试期数：${currentSheetName}\n`;
    emailContent += `测试时间：${new Date().toLocaleString()}\n\n`;
    emailContent += '答题情况：\n\n';
    
    currentQuestions.forEach((question, index) => {
        const answer = currentAnswers[index];
        let answerText = '';
        
        if (question.type === 'single' || question.type === 'multiple') {
            if (Array.isArray(answer)) {
                answerText = answer.join(', ');
            } else {
                answerText = answer || '未作答';
            }
        } else if (question.type === 'fill') {
            answerText = answer ? answer.join(', ') : '未作答';
        }
        
        emailContent += `问题 ${question.id}：${question.content}\n`;
        emailContent += `答案：${answerText}\n\n`;
    });
    
    // 硬编码邮箱配置信息（用于调试）
    const emailConfig = {
        smtpServer: 'smtp.qq.com',
        smtpPort: 465,
        emailUsername: '308852547@qq.com',
        emailPassword: 'khtsatqetpeobhjf',
        recipientEmail: '308852547@qq.com'
    };
    
    // 显示硬编码的配置信息
    console.log('Using hardcoded email config:', emailConfig);
    
    // 检查SMTP.js是否加载
    if (typeof Email === 'undefined') {
        showEmailStatusMessage('邮件发送库未加载，使用备选方案', 'info');
        // 使用备选方案：mailto链接
        const subject = `英语学习效果评估 - ${currentUser.username} - ${currentSheetName}`;
        const mailtoLink = `mailto:${emailConfig.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
        const mailWindow = window.open(mailtoLink);
        setTimeout(() => {
            if (mailWindow) {
                showEmailStatusMessage('邮件已准备，请在邮件客户端中发送', 'success');
                retryUploadBtn.style.display = 'none';
            } else {
                showEmailStatusMessage('邮件发送失败，请检查邮件客户端', 'error');
                retryUploadBtn.style.display = 'inline-block';
            }
        }, 1000);
        return;
    }
    
    // 显示发送状态
    showEmailStatusMessage('正在发送邮件...', 'info');
    
    // 打印配置信息（仅用于调试）
    console.log('Email Config:', {
        smtpServer: emailConfig.smtpServer,
        smtpPort: emailConfig.smtpPort,
        emailUsername: emailConfig.emailUsername,
        recipientEmail: emailConfig.recipientEmail,
        emailPassword: '*** (hidden)' // 不打印密码
    });
    
    // 显示配置信息（仅用于调试）
    console.log('Sending email from:', emailConfig.emailUsername);
    console.log('Sending email to:', emailConfig.recipientEmail);
    console.log('Using SMTP server:', emailConfig.smtpServer + ':' + emailConfig.smtpPort);
    
    // 使用SMTP.js发送邮件
    try {
        Email.send({
            Host: emailConfig.smtpServer,
            Port: emailConfig.smtpPort,
            Username: emailConfig.emailUsername,
            Password: emailConfig.emailPassword,
            To: emailConfig.recipientEmail,
            From: emailConfig.emailUsername,
            Subject: `英语学习效果评估 - ${currentUser.username} - ${currentSheetName}`,
            Body: emailContent,
            Secure: true, // 启用SSL
            TLS: false, // 禁用TLS，使用SSL
            SMTPSecure: 'ssl', // 明确指定使用SSL
            SMTPAuth: true // 启用SMTP认证
        }).then(
            message => {
                console.log('Email send result:', message);
                if (message === "OK") {
                    showEmailStatusMessage('邮件发送成功', 'success');
                    retryUploadBtn.style.display = 'none';
                } else {
                    showEmailStatusMessage('邮件发送失败：' + message, 'error');
                    console.log('SMTP.js error message:', message);
                    // 尝试备选方案
                    setTimeout(() => {
                        showEmailStatusMessage('尝试使用备选方案...', 'info');
                        const subject = `英语学习效果评估 - ${currentUser.username} - ${currentSheetName}`;
                        const mailtoLink = `mailto:${emailConfig.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
                        const mailWindow = window.open(mailtoLink);
                        setTimeout(() => {
                            if (mailWindow) {
                                showEmailStatusMessage('邮件已准备，请在邮件客户端中发送', 'success');
                                retryUploadBtn.style.display = 'none';
                            } else {
                                showEmailStatusMessage('邮件发送失败，请检查邮件客户端', 'error');
                                retryUploadBtn.style.display = 'inline-block';
                            }
                        }, 1000);
                    }, 1000);
                }
            },
            error => {
                console.error('Email send error:', error);
                showEmailStatusMessage('邮件发送失败：' + error, 'error');
                // 尝试备选方案
                setTimeout(() => {
                    showEmailStatusMessage('尝试使用备选方案...', 'info');
                    const subject = `英语学习效果评估 - ${currentUser.username} - ${currentSheetName}`;
                    const mailtoLink = `mailto:${emailConfig.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
                    const mailWindow = window.open(mailtoLink);
                    setTimeout(() => {
                        if (mailWindow) {
                            showEmailStatusMessage('邮件已准备，请在邮件客户端中发送', 'success');
                            retryUploadBtn.style.display = 'none';
                        } else {
                            showEmailStatusMessage('邮件发送失败，请检查邮件客户端', 'error');
                            retryUploadBtn.style.display = 'inline-block';
                        }
                    }, 1000);
                }, 1000);
            }
        );
    } catch (e) {
        console.error('Email send exception:', e);
        showEmailStatusMessage('邮件发送失败：' + e.message, 'error');
        // 尝试备选方案
        setTimeout(() => {
            showEmailStatusMessage('尝试使用备选方案...', 'info');
            const subject = `英语学习效果评估 - ${currentUser.username} - ${currentSheetName}`;
            const mailtoLink = `mailto:${emailConfig.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
            const mailWindow = window.open(mailtoLink);
            setTimeout(() => {
                if (mailWindow) {
                    showEmailStatusMessage('邮件已准备，请在邮件客户端中发送', 'success');
                    retryUploadBtn.style.display = 'none';
                } else {
                    showEmailStatusMessage('邮件发送失败，请检查邮件客户端', 'error');
                    retryUploadBtn.style.display = 'inline-block';
                }
            }, 1000);
        }, 1000);
    }
}

// 重新上传按钮点击事件
retryUploadBtn.addEventListener('click', function() {
    sendEmail();
});

// 显示邮箱状态消息
function showEmailStatusMessage(message, type) {
    emailStatusMessage.textContent = message;
    emailStatusMessage.className = type;
    emailStatusMessage.style.display = 'block';
    
    if (type === 'error') {
        emailStatusMessage.style.backgroundColor = '#ffebee';
        emailStatusMessage.style.color = '#c62828';
    } else if (type === 'success') {
        emailStatusMessage.style.backgroundColor = '#e8f5e8';
        emailStatusMessage.style.color = '#2e7d32';
    } else if (type === 'info') {
        emailStatusMessage.style.backgroundColor = '#e3f2fd';
        emailStatusMessage.style.color = '#1976d2';
    }
}

// 导出答卷
function exportResult() {
    // 准备导出数据
    const exportData = currentQuestions.map((question, index) => {
        const answer = currentAnswers[index];
        let answerText = '';
        
        if (question.type === 'single' || question.type === 'multiple') {
            if (Array.isArray(answer)) {
                answerText = answer.join(', ');
            } else {
                answerText = answer || '未作答';
            }
        } else if (question.type === 'fill') {
            answerText = answer ? answer.join(', ') : '未作答';
        }
        
        return {
            '题号': question.id,
            '学生': currentUser.username,
            '问题': question.content,
            '题型': question.type,
            '答案': answerText,
            '测试时间': new Date().toLocaleString()
        };
    });
    
    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, currentSheetName);
    
    // 导出文件
    XLSX.writeFile(workbook, `${currentUser.username}_${currentSheetName}_答卷.xlsx`);
}

// 返回测试页面
exportBtn.addEventListener('click', exportResult);

backToTestBtn.addEventListener('click', function() {
    testPage.classList.add('active');
    resultPage.classList.remove('active');
    setTimeout(() => {
        resultPage.style.display = 'none';
        testPage.style.display = 'block';
    }, 500);
});

// 用户管理相关功能

// 显示用户管理页面
function showUserManagementPage() {
    testPage.classList.remove('active');
    userManagementPage.classList.add('active');
    setTimeout(() => {
        testPage.style.display = 'none';
        userManagementPage.style.display = 'block';
        // 显示用户列表
        displayUserList();
    }, 500);
}

// 用户管理按钮点击事件
userManagementBtn.addEventListener('click', function() {
    showUserManagementPage();
});

// 从用户管理页面返回测试页面
backToTestBtnFromManagement.addEventListener('click', function() {
    showTestPage();
});

let editUserId = -1; // 用于标识当前编辑的用户索引

// 添加用户
addUserBtn.addEventListener('click', function() {
    const newUsername = newUsernameInput.value.trim();
    const newPassword = newPasswordInput.value;
    const newRemark = newRemarkInput.value.trim();

    if (!newUsername || !newPassword || !newRemark) {
        showAddUserMessage('请填写所有字段', 'error');
        return;
    }

    // 检查用户名是否已存在（编辑模式下跳过当前用户）
    if (userData.find((u, index) => u.username === newUsername && index !== editUserId)) {
        showAddUserMessage('用户名已存在', 'error');
        return;
    }

    if (editUserId === -1) {
        // 添加新用户
        userData.push({
            username: newUsername,
            password: newPassword,
            remark: newRemark
        });
        showAddUserMessage('用户添加成功', 'success');
    } else {
        // 更新用户
        userData[editUserId] = {
            username: newUsername,
            password: newPassword,
            remark: newRemark
        };
        showAddUserMessage('用户更新成功', 'success');
        editUserId = -1;
        addUserBtn.textContent = '添加用户';
    }

    // 保存用户数据
    saveUserData();

    // 清空表单
    newUsernameInput.value = '';
    newPasswordInput.value = '';
    newRemarkInput.value = '';

    // 更新用户列表
    displayUserList();
});

// 编辑用户
function editUser(index) {
    const user = userData[index];
    newUsernameInput.value = user.username;
    newPasswordInput.value = user.password;
    newRemarkInput.value = user.remark;
    editUserId = index;
    addUserBtn.textContent = '更新用户';
}

// 删除用户
function deleteUser(index) {
    if (confirm('确定要删除该用户吗？')) {
        userData.splice(index, 1);
        saveUserData();
        displayUserList();
        showAddUserMessage('用户删除成功', 'success');
    }
}

// 习题管理相关功能

// 显示习题管理页面
function showQuestionManagementPage() {
    testPage.classList.remove('active');
    questionManagementPage.classList.add('active');
    setTimeout(() => {
        testPage.style.display = 'none';
        questionManagementPage.style.display = 'block';
        // 初始化期数选择
        initQuestionPeriodSelect();
        // 显示习题列表
        displayQuestionList();
    }, 500);
}

// 习题管理按钮点击事件
questionManagementBtn.addEventListener('click', function() {
    showQuestionManagementPage();
});

// 从习题管理页面返回测试页面
backToTestBtnFromQuestionManagement.addEventListener('click', function() {
    showTestPage();
    // 更新测试表单的期数选择
    updateTestForm();
});

// 初始化习题期数选择
function initQuestionPeriodSelect() {
    // 获取所有唯一的期数
    const periods = [...new Set(questionData.map(q => q.period))].sort((a, b) => a - b);
    
    questionPeriodSelect.innerHTML = "";
    periods.forEach(period => {
        const option = document.createElement('option');
        option.value = period;
        option.textContent = `第${period}期`;
        questionPeriodSelect.appendChild(option);
    });
    
    // 添加空选项
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '所有期数';
    questionPeriodSelect.insertBefore(emptyOption, questionPeriodSelect.firstChild);
}

// 添加习题
addQuestionBtn.addEventListener('click', function() {
    console.log('添加习题按钮被点击');
    const period = parseInt(questionPeriodInput.value);
    const content = questionContentInput.value.trim();
    const type = questionTypeSelect.value;
    const optionA = optionAInput.value.trim();
    const optionB = optionBInput.value.trim();
    const optionC = optionCInput.value.trim();
    const optionD = optionDInput.value.trim();
    const audioFile = questionAudioFileInput.files[0];
    const timeLimit = parseInt(questionTimeLimitInput.value);
    
    console.log('表单数据:', {
        period: period,
        content: content,
        type: type,
        optionA: optionA,
        optionB: optionB,
        optionC: optionC,
        optionD: optionD,
        audioFile: audioFile ? audioFile.name : '无',
        timeLimit: timeLimit
    });

    if (!period || !type || !timeLimit) {
        showAddQuestionMessage('请填写期数、题型和时限', 'error');
        return;
    }
    
    // 对于非拼写填空题，要求填写问题内容
    if (type !== 'fill' && !content) {
        showAddQuestionMessage('请填写问题内容', 'error');
        return;
    }

    // 确保时限大于0
    if (timeLimit <= 0) {
        showAddQuestionMessage('时限必须大于0秒', 'error');
        return;
    }

    // 检查选项
    if ((type === 'single' || type === 'multiple') && !optionA && !optionB) {
        showAddQuestionMessage('单选题和多选题至少需要填写选项A和B', 'error');
        return;
    }

    // 检查拼写填空题是否提供音频文件
    if (type === 'fill' && !audioFile) {
        // 如果是编辑模式且已有音频文件，则不需要重新上传
        if (editQuestionId === -1 || !questionData[editQuestionId].audio) {
            showAddQuestionMessage('拼写填空题必须提供音频文件', 'error');
            return;
        }
    }

    // 处理音频文件
    if (audioFile) {
        // 检查文件类型
        const allowedTypes = ['.mp3', '.wav', '.ogg'];
        const fileExtension = audioFile.name.toLowerCase().substring(audioFile.name.lastIndexOf('.'));
        if (!allowedTypes.includes(fileExtension)) {
            showAddQuestionMessage('音频文件类型不支持，仅支持mp3、wav、ogg格式', 'error');
            return;
        }

        // 检查多选题音频时长
        if (type === 'multiple') {
            const minAudioTime = 5;
            if (timeLimit <= minAudioTime) {
                showAddQuestionMessage('多选题音频时长较长，时限应大于音频时长（至少5秒）', 'error');
                return;
            }
        }
    }

    // 处理添加/更新习题的逻辑
    function processQuestion(audioName = '') {
        if (editQuestionId === -1) {
            // 检查是否手动输入了题号
            let newId = parseInt(questionIdInput.value);
            if (isNaN(newId)) {
                // 自动生成题号（按期数和类型排序）
                const periodQuestions = questionData.filter(q => q.period === period);
                const typeOrder = { 'single': 1, 'multiple': 2, 'fill': 3 };
                const sortedQuestions = periodQuestions.sort((a, b) => {
                    if (typeOrder[a.type] !== typeOrder[b.type]) {
                        return typeOrder[a.type] - typeOrder[b.type];
                    }
                    return (a.id || 0) - (b.id || 0);
                });
                newId = sortedQuestions.length > 0 ? sortedQuestions[sortedQuestions.length - 1].id + 1 : 1;
            }
            
            // 添加新习题
            questionData.push({
                id: newId,
                period: period,
                content: content,
                type: type,
                optionA: optionA,
                optionB: optionB,
                optionC: optionC,
                optionD: optionD,
                audio: audioName,
                timeLimit: timeLimit
            });
            console.log('习题添加成功，当前习题数量:', questionData.length);
            showAddQuestionMessage('习题添加成功', 'success');
        } else {
            // 检查是否手动输入了题号
            let newId = parseInt(questionIdInput.value);
            if (isNaN(newId)) {
                newId = questionData[editQuestionId].id; // 保留原有题号
            }
            
            // 更新习题
            questionData[editQuestionId] = {
                id: newId,
                period: period,
                content: content,
                type: type,
                optionA: optionA,
                optionB: optionB,
                optionC: optionC,
                optionD: optionD,
                audio: audioName || questionData[editQuestionId].audio, // 保留原有音频
                timeLimit: timeLimit
            };
            showAddQuestionMessage('习题更新成功', 'success');
            editQuestionId = -1;
            addQuestionBtn.textContent = '添加习题';
        }

        // 保存习题数据
        saveQuestionData();
        console.log('习题数据保存成功');

        // 清空表单
        questionIdInput.value = '';
        questionPeriodInput.value = '';
        questionContentInput.value = '';
        questionTypeSelect.value = 'single';
        optionAInput.value = '';
        optionBInput.value = '';
        optionCInput.value = '';
        optionDInput.value = '';
        questionAudioFileInput.value = '';
        questionTimeLimitInput.value = '10';
        
        // 移除音频预览
        const existingPreview = document.getElementById('audio-preview');
        if (existingPreview) {
            existingPreview.remove();
        }

        // 更新习题列表和期数选择
        initQuestionPeriodSelect();
        displayQuestionList();
    }

    // 读取音频文件
    if (audioFile) {
        console.log('开始处理音频文件:', audioFile.name);
        try {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    console.log('音频文件读取成功');
                    const audioData = e.target.result;
                    const audioName = audioFile.name;
                    
                    // 保存音频文件
                    console.log('开始保存音频文件:', audioName);
                    saveAudioFile(audioName, audioData);
                    console.log('音频文件保存成功');
                    
                    console.log('准备添加习题:', {
                        period: period,
                        type: type,
                        content: content,
                        audio: audioName,
                        timeLimit: timeLimit
                    });
                    
                    // 处理习题
                    processQuestion(audioName);
                } catch (error) {
                    console.error('处理音频数据时出错:', error);
                    showAddQuestionMessage('处理音频数据时出错: ' + error.message, 'error');
                }
            };
            reader.onerror = function(error) {
                console.error('读取音频文件时出错:', error);
                showAddQuestionMessage('读取音频文件时出错: ' + error.message, 'error');
            };
            reader.readAsDataURL(audioFile);
        } catch (error) {
            console.error('创建FileReader时出错:', error);
            showAddQuestionMessage('处理音频文件时出错: ' + error.message, 'error');
        }
    } else {
        // 没有音频文件，直接处理习题
        processQuestion();
    }
});

// 编辑习题
function editQuestion(index) {
    const question = questionData[index];
    questionIdInput.value = question.id;
    questionPeriodInput.value = question.period;
    questionContentInput.value = question.content;
    questionTypeSelect.value = question.type;
    optionAInput.value = question.optionA || '';
    optionBInput.value = question.optionB || '';
    optionCInput.value = question.optionC || '';
    optionDInput.value = question.optionD || '';
    questionTimeLimitInput.value = question.timeLimit;
    editQuestionId = index;
    addQuestionBtn.textContent = '更新习题';
    
    // 触发题型选择变化事件，隐藏/显示选项字段
    const event = new Event('change');
    questionTypeSelect.dispatchEvent(event);
    
    // 显示当前音频文件信息
    if (question.audio) {
        const audioFiles = getAudioFiles();
        const audioData = audioFiles[question.audio];
        if (audioData) {
            // 创建临时音频元素用于预览
            const tempAudio = document.createElement('audio');
            tempAudio.controls = true;
            tempAudio.src = audioData;
            tempAudio.style.width = '200px';
            tempAudio.style.marginTop = '10px';
            
            // 移除之前的预览
            const existingPreview = document.getElementById('audio-preview');
            if (existingPreview) {
                existingPreview.remove();
            }
            
            // 添加预览
            const audioPreview = document.createElement('div');
            audioPreview.id = 'audio-preview';
            audioPreview.innerHTML = `<p>当前音频文件: ${question.audio}</p>`;
            audioPreview.appendChild(tempAudio);
            questionAudioFileInput.parentNode.appendChild(audioPreview);
        }
    } else {
        // 移除之前的预览
        const existingPreview = document.getElementById('audio-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
    }
}

// 删除习题
function deleteQuestion(index) {
    if (confirm('确定要删除该习题吗？')) {
        questionData.splice(index, 1);
        saveQuestionData();
        displayQuestionList();
        showAddQuestionMessage('习题删除成功', 'success');
    }
}

// 保存音频文件到本地存储
function saveAudioFile(filename, data) {
    try {
        const audioFiles = getAudioFiles();
        audioFiles[filename] = data;
        const audioFilesJson = JSON.stringify(audioFiles);
        
        // 检查存储空间
        if (audioFilesJson.length > 5 * 1024 * 1024) { // 5MB限制
            throw new Error('音频文件存储空间不足');
        }
        
        localStorage.setItem('audioFiles', audioFilesJson);
        return true;
    } catch (error) {
        console.error('保存音频文件失败:', error);
        throw error;
    }
}

// 获取音频文件
function getAudioFiles() {
    const storedAudio = localStorage.getItem('audioFiles');
    if (storedAudio) {
        return JSON.parse(storedAudio);
    } else {
        return {};
    }
}

// 批量导入习题
importQuestionBtn.addEventListener('click', function() {
    const importFile = importFileInput.files[0];
    const audioFiles = importAudioFilesInput.files;

    if (!importFile) {
        showImportQuestionMessage('请选择导入文件', 'error');
        return;
    }

    // 读取导入文件
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let importedQuestions = [];
            
            // 根据文件类型处理
            if (importFile.name.endsWith('.csv')) {
                // 处理CSV文件
                const csvContent = e.target.result;
                importedQuestions = parseCSV(csvContent);
            } else {
                // 处理Excel文件
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                importedQuestions = XLSX.utils.sheet_to_json(worksheet);
            }

            // 直接导入习题，不再处理音频文件上传
            importQuestions(importedQuestions);
        } catch (error) {
            showImportQuestionMessage('导入文件格式错误', 'error');
            console.error(error);
        }
    };
    reader.readAsArrayBuffer(importFile);
});

// 解析CSV文件
function parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const questions = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim());
        if (values.length >= headers.length) {
            const question = {};
            headers.forEach((header, index) => {
                question[header] = values[index];
            });
            questions.push(question);
        }
    }

    return questions;
}

// 导入习题
function importQuestions(importedQuestions) {
    let successCount = 0;
    let errorCount = 0;
    let missingAudioFiles = [];
    let errorMessages = [];

    // 检查所有音频文件是否存在
    importedQuestions.forEach(question => {
        const audio = question.audio || question.音频 || '';
        if (audio) {
            // 创建音频元素来检查文件是否存在
            const audioElement = new Audio(audio);
            audioElement.onerror = function() {
                if (!missingAudioFiles.includes(audio)) {
                    missingAudioFiles.push(audio);
                }
            };
        }
    });

    // 延迟执行导入，等待音频文件检查完成
    setTimeout(() => {
        // 如果有缺失的音频文件，显示提示并停止导入
        if (missingAudioFiles.length > 0) {
            const missingFiles = missingAudioFiles.join(', ');
            showImportQuestionMessage(`导入失败：缺少以下音频文件：${missingFiles}`, 'error');
            return;
        }

        importedQuestions.forEach((question, index) => {
            try {
                const id = parseInt(question.id) || parseInt(question.题号) || 0;
                const period = parseInt(question.period) || parseInt(question.期数) || 0;
                const content = question.content || question.问题 || '';
                const type = question.type || question.题型 || '';
                const optionA = question.optionA || question.A || '';
                const optionB = question.optionB || question.B || '';
                const optionC = question.optionC || question.C || '';
                const optionD = question.optionD || question.D || '';
                const audio = question.audio || question.音频 || '';
                const timeLimit = parseInt(question.timeLimit || question.时限 || 0);

                // 验证必填字段
                if (!id || !period || !type || !timeLimit || timeLimit <= 0) {
                    errorCount++;
                    errorMessages.push(`第${index + 1}行：缺少必填字段或时限无效`);
                    return;
                }

                // 验证题型
                if (!['single', 'multiple', 'fill'].includes(type)) {
                    errorCount++;
                    errorMessages.push(`第${index + 1}行：题型无效，必须是single、multiple或fill`);
                    return;
                }

                // 对于多选题，要求填写问题内容
                if (type === 'multiple' && !content) {
                    errorCount++;
                    errorMessages.push(`第${index + 1}行：多选题必须填写问题内容`);
                    return;
                }

                // 检查选项
                if ((type === 'single' || type === 'multiple') && !optionA && !optionB) {
                    errorCount++;
                    errorMessages.push(`第${index + 1}行：单选题和多选题至少需要填写选项A和B`);
                    return;
                }

                // 检查拼写填空题是否提供音频文件
                if (type === 'fill' && !audio) {
                    errorCount++;
                    errorMessages.push(`第${index + 1}行：拼写填空题必须提供音频文件`);
                    return;
                }

                // 检查多选题音频时长
                if (type === 'multiple' && audio) {
                    const minAudioTime = 5;
                    if (timeLimit <= minAudioTime) {
                        errorCount++;
                        errorMessages.push(`第${index + 1}行：多选题音频时长较长，时限应大于音频时长（至少5秒）`);
                        return;
                    }
                }

                // 检查是否已存在相同题号和期号的习题
                const existingIndex = questionData.findIndex(q => q.id === id && q.period === period);
                
                if (existingIndex > -1) {
                    // 覆盖现有习题
                    questionData[existingIndex] = {
                        id: id,
                        period: period,
                        content: content,
                        type: type,
                        optionA: optionA,
                        optionB: optionB,
                        optionC: optionC,
                        optionD: optionD,
                        audio: audio,
                        timeLimit: timeLimit
                    };
                } else {
                    // 添加新习题
                    questionData.push({
                        id: id,
                        period: period,
                        content: content,
                        type: type,
                        optionA: optionA,
                        optionB: optionB,
                        optionC: optionC,
                        optionD: optionD,
                        audio: audio,
                        timeLimit: timeLimit
                    });
                }

                successCount++;
            } catch (error) {
                errorCount++;
                errorMessages.push(`第${index + 1}行：处理错误 - ${error.message}`);
                console.error(error);
            }
        });

        // 保存习题数据
        saveQuestionData();

        // 更新习题列表和期数选择
        initQuestionPeriodSelect();
        displayQuestionList();

        // 显示导入结果
        let message = `导入完成：成功 ${successCount} 题，失败 ${errorCount} 题`;
        if (errorMessages.length > 0) {
            message += '\n\n失败原因：\n' + errorMessages.join('\n');
        }
        showImportQuestionMessage(message, successCount > 0 ? 'success' : 'error');

        // 清空表单
        importFileInput.value = '';
        importAudioFilesInput.value = '';
    }, 1000); // 延迟1秒执行，确保音频文件检查完成
}

// 显示导入习题消息
function showImportQuestionMessage(message, type) {
    // 将换行符转换为HTML换行
    importQuestionMessage.innerHTML = message.replace(/\n/g, '<br>');
    importQuestionMessage.className = type;
    importQuestionMessage.style.display = 'block';
    importQuestionMessage.style.padding = '10px';
    importQuestionMessage.style.borderRadius = '4px';
    importQuestionMessage.style.whiteSpace = 'pre-line';
    importQuestionMessage.style.maxHeight = '300px';
    importQuestionMessage.style.overflowY = 'auto';
    
    if (type === 'error') {
        importQuestionMessage.style.backgroundColor = '#ffebee';
        importQuestionMessage.style.color = '#c62828';
    } else {
        importQuestionMessage.style.backgroundColor = '#e8f5e8';
        importQuestionMessage.style.color = '#2e7d32';
    }
    
    // 10秒后隐藏消息（增加时间以便查看详细错误信息）
    setTimeout(() => {
        importQuestionMessage.style.display = 'none';
    }, 10000);
}

// 显示习题列表
let editQuestionId = -1; // 用于标识当前编辑的习题索引

function displayQuestionList() {
    const selectedPeriod = parseInt(questionPeriodSelect.value);
    let filteredQuestions = questionData;
    
    if (!isNaN(selectedPeriod)) {
        filteredQuestions = questionData.filter(q => q.period === selectedPeriod);
    }

    if (filteredQuestions.length === 0) {
        questionListContainer.innerHTML = '<p>暂无习题</p>';
        return;
    }

    let questionListHTML = '<table style="width: 100%; border-collapse: collapse;">';
    questionListHTML += '<tr style="border-bottom: 1px solid #ddd;"><th style="padding: 8px; text-align: left;">题号</th><th style="padding: 8px; text-align: left;">期数</th><th style="padding: 8px; text-align: left;">问题内容</th><th style="padding: 8px; text-align: left;">题型</th><th style="padding: 8px; text-align: left;">时限（秒）</th><th style="padding: 8px; text-align: left;">音频</th><th style="padding: 8px; text-align: left;">操作</th></tr>';

    filteredQuestions.forEach((question, index) => {
        // 找到在原始数组中的索引
        const originalIndex = questionData.findIndex(q => 
            q.period === question.period && 
            q.type === question.type &&
            (q.id === question.id || (q.content === question.content && question.content))
        );
        
        let typeText = '';
        switch (question.type) {
            case 'single':
                typeText = '单选题';
                break;
            case 'multiple':
                typeText = '多选题';
                break;
            case 'fill':
                typeText = '填空题';
                break;
        }
        
        let audioHTML = '';
        if (question.audio) {
            audioHTML = `<audio controls style="width: 100px;"><source src="${question.audio}" type="audio/mpeg">您的浏览器不支持音频播放</audio>`;
        } else {
            audioHTML = '无';
        }
        
        questionListHTML += `<tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">${question.id || 'N/A'}</td><td style="padding: 8px;">第${question.period}期</td><td style="padding: 8px;">${question.content}</td><td style="padding: 8px;">${typeText}</td><td style="padding: 8px;">${question.timeLimit}</td><td style="padding: 8px;">${audioHTML}</td><td style="padding: 8px;"><button onclick="editQuestion(${originalIndex})">编辑</button><button onclick="deleteQuestion(${originalIndex})">删除</button></td></tr>`;
    });

    questionListHTML += '</table>';
    questionListContainer.innerHTML = questionListHTML;
}

// 习题期数选择变化事件
questionPeriodSelect.addEventListener('change', function() {
    displayQuestionList();
});

// 题型选择变化事件
questionTypeSelect.addEventListener('change', function() {
    const type = questionTypeSelect.value;
    const optionFields = document.querySelectorAll('#option-a, #option-b, #option-c, #option-d');
    const optionLabels = document.querySelectorAll('label[for="option-a"], label[for="option-b"], label[for="option-c"], label[for="option-d"]');
    const contentField = document.getElementById('question-content');
    const contentHint = document.getElementById('content-hint');
    
    if (type === 'fill') {
        // 隐藏选项字段
        optionFields.forEach(field => {
            field.parentElement.style.display = 'none';
        });
        optionLabels.forEach(label => {
            label.parentElement.style.display = 'none';
        });
        // 更新问题内容字段提示
        contentHint.textContent = '拼写填空题无需填写问题内容';
        contentField.removeAttribute('required');
    } else {
        // 显示选项字段
        optionFields.forEach(field => {
            field.parentElement.style.display = 'block';
        });
        optionLabels.forEach(label => {
            label.parentElement.style.display = 'block';
        });
        // 恢复问题内容字段提示
        contentHint.textContent = '请输入问题内容';
        contentField.setAttribute('required', 'required');
    }
});

// 显示添加习题消息
function showAddQuestionMessage(message, type) {
    addQuestionMessage.textContent = message;
    addQuestionMessage.className = type;
    addQuestionMessage.style.display = 'block';
    
    if (type === 'error') {
        addQuestionMessage.style.backgroundColor = '#ffebee';
        addQuestionMessage.style.color = '#c62828';
    } else {
        addQuestionMessage.style.backgroundColor = '#e8f5e8';
        addQuestionMessage.style.color = '#2e7d32';
    }
    
    // 3秒后隐藏消息
    setTimeout(() => {
        addQuestionMessage.style.display = 'none';
    }, 3000);
}

// 邮箱配置相关功能

// 显示邮箱配置页面
function showEmailConfigPage() {
    testPage.classList.remove('active');
    emailConfigPage.classList.add('active');
    setTimeout(() => {
        testPage.style.display = 'none';
        emailConfigPage.style.display = 'block';
        // 加载邮箱配置
        loadEmailConfig();
    }, 500);
}

// 邮箱配置按钮点击事件
emailConfigBtn.addEventListener('click', function() {
    showEmailConfigPage();
});

// 从邮箱配置页面返回测试页面
backToTestBtnFromEmailConfig.addEventListener('click', function() {
    showTestPage();
});

// 数据管理相关功能

// 显示数据管理页面
function showDataManagementPage() {
    testPage.classList.remove('active');
    dataManagementPage.classList.add('active');
    setTimeout(() => {
        testPage.style.display = 'none';
        dataManagementPage.style.display = 'block';
    }, 500);
}

// 数据管理按钮点击事件
dataManagementBtn.addEventListener('click', function() {
    showDataManagementPage();
});

// 从数据管理页面返回测试页面
backToTestBtnFromDataManagement.addEventListener('click', function() {
    showTestPage();
});

// 导出所有数据
exportAllDataBtn.addEventListener('click', function() {
    try {
        // 收集所有数据
        const allData = {
            users: userData,
            questions: questionData,
            audioFiles: getAudioFiles(),
            emailConfig: initEmailConfig(),
            exportDate: new Date().toISOString()
        };
        
        // 创建JSON文件
        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // 下载文件
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `英语学习系统数据_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        showExportDataMessage('数据导出成功', 'success');
    } catch (error) {
        showExportDataMessage('数据导出失败', 'error');
        console.error(error);
    }
});

// 导出为initial_data.json格式
document.getElementById('export-initial-data-btn').addEventListener('click', function() {
    try {
        // 收集所有数据
        const allData = {
            users: userData,
            questions: questionData,
            audioFiles: getAudioFiles(),
            emailConfig: initEmailConfig(),
            exportDate: new Date().toISOString()
        };
        
        // 创建JSON文件
        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // 下载文件
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'initial_data.json';
        link.click();
        URL.revokeObjectURL(url);
        
        showExportDataMessage('initial_data.json导出成功', 'success');
    } catch (error) {
        showExportDataMessage('数据导出失败', 'error');
        console.error(error);
    }
});

// 导出所有用户答案
document.getElementById('export-user-answers-btn').addEventListener('click', function() {
    try {
        // 准备导出数据
        const exportData = [];
        
        userAnswersData.forEach(userAnswer => {
            userAnswer.answers.forEach(answer => {
                exportData.push({
                    '用户ID': userAnswer.userId,
                    '用户名': userAnswer.username,
                    '测试期数': userAnswer.testPeriod,
                    '测试时间': new Date(userAnswer.testTime).toLocaleString(),
                    '题号': answer.questionId,
                    '问题内容': answer.questionContent,
                    '题型': answer.questionType,
                    '答案': answer.answer
                });
            });
        });
        
        // 检查是否有答案数据
        if (exportData.length === 0) {
            showExportDataMessage('暂无用户答案数据', 'info');
            return;
        }
        
        // 创建工作簿
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(workbook, worksheet, '用户答案');
        
        // 导出文件
        XLSX.writeFile(workbook, `用户答案汇总_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        showExportDataMessage('用户答案导出成功', 'success');
    } catch (error) {
        showExportDataMessage('用户答案导出失败', 'error');
        console.error(error);
    }
});

// 导入所有数据
importAllDataBtn.addEventListener('click', function() {
    const importFile = importAllDataFile.files[0];
    if (!importFile) {
        showImportDataMessage('请选择数据文件', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // 验证数据格式
            if (!importedData.users || !importedData.questions) {
                throw new Error('数据格式错误');
            }
            
            // 导入数据
            userData = importedData.users;
            questionData = importedData.questions;
            
            // 导入音频文件
            if (importedData.audioFiles) {
                localStorage.setItem('audioFiles', JSON.stringify(importedData.audioFiles));
            }
            
            // 导入邮箱配置
            if (importedData.emailConfig) {
                saveEmailConfig(importedData.emailConfig);
            }
            
            // 保存数据
            saveUserData();
            saveQuestionData();
            
            showImportDataMessage('数据导入成功', 'success');
        } catch (error) {
            showImportDataMessage('数据导入失败', 'error');
            console.error(error);
        }
    };
    reader.readAsText(importFile);
});

// 显示导出数据消息
function showExportDataMessage(message, type) {
    exportDataMessage.textContent = message;
    exportDataMessage.className = type;
    exportDataMessage.style.display = 'block';
    
    if (type === 'error') {
        exportDataMessage.style.backgroundColor = '#ffebee';
        exportDataMessage.style.color = '#c62828';
    } else {
        exportDataMessage.style.backgroundColor = '#e8f5e8';
        exportDataMessage.style.color = '#2e7d32';
    }
    
    // 3秒后隐藏消息
    setTimeout(() => {
        exportDataMessage.style.display = 'none';
    }, 3000);
}

// 显示导入数据消息
function showImportDataMessage(message, type) {
    importDataMessage.textContent = message;
    importDataMessage.className = type;
    importDataMessage.style.display = 'block';
    
    if (type === 'error') {
        importDataMessage.style.backgroundColor = '#ffebee';
        importDataMessage.style.color = '#c62828';
    } else {
        importDataMessage.style.backgroundColor = '#e8f5e8';
        importDataMessage.style.color = '#2e7d32';
    }
    
    // 3秒后隐藏消息
    setTimeout(() => {
        importDataMessage.style.display = 'none';
    }, 3000);
}

// 加载邮箱配置
function loadEmailConfig() {
    const config = initEmailConfig();
    smtpServerInput.value = config.smtpServer;
    smtpPortInput.value = config.smtpPort;
    emailUsernameInput.value = config.emailUsername;
    emailPasswordInput.value = config.emailPassword;
    recipientEmailInput.value = config.recipientEmail;
}

// 保存邮箱配置
function saveEmailConfigBtnClick() {
    const config = {
        smtpServer: smtpServerInput.value.trim(),
        smtpPort: parseInt(smtpPortInput.value),
        emailUsername: emailUsernameInput.value.trim(),
        emailPassword: emailPasswordInput.value,
        recipientEmail: recipientEmailInput.value.trim()
    };
    
    if (!config.smtpServer || !config.smtpPort || !config.emailUsername || !config.emailPassword || !config.recipientEmail) {
        showEmailConfigMessage('请填写所有字段', 'error');
        return;
    }
    
    // 保存配置
    saveEmailConfig(config);
    showEmailConfigMessage('配置保存成功', 'success');
}

// 保存邮箱配置按钮点击事件
saveEmailConfigBtn.addEventListener('click', saveEmailConfigBtnClick);

// 显示邮箱配置消息
function showEmailConfigMessage(message, type) {
    emailConfigMessage.textContent = message;
    emailConfigMessage.className = type;
    emailConfigMessage.style.display = 'block';
    
    if (type === 'error') {
        emailConfigMessage.style.backgroundColor = '#ffebee';
        emailConfigMessage.style.color = '#c62828';
    } else {
        emailConfigMessage.style.backgroundColor = '#e8f5e8';
        emailConfigMessage.style.color = '#2e7d32';
    }
    
    // 3秒后隐藏消息
    setTimeout(() => {
        emailConfigMessage.style.display = 'none';
    }, 3000);
}

// 显示用户列表
function displayUserList() {
    if (userData.length === 0) {
        userListContainer.innerHTML = '<p>暂无用户</p>';
        return;
    }

    let userListHTML = '<table style="width: 100%; border-collapse: collapse;">';
    userListHTML += '<tr style="border-bottom: 1px solid #ddd;"><th style="padding: 8px; text-align: left;">用户名</th><th style="padding: 8px; text-align: left;">备注（真实姓名）</th><th style="padding: 8px; text-align: left;">操作</th></tr>';

    userData.forEach((user, index) => {
        userListHTML += `<tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">${user.username}</td><td style="padding: 8px;">${user.remark}</td><td style="padding: 8px;"><button onclick="editUser(${index})">编辑</button><button onclick="deleteUser(${index})">删除</button></td></tr>`;
    });

    userListHTML += '</table>';
    userListContainer.innerHTML = userListHTML;
}

// 显示添加用户消息
function showAddUserMessage(message, type) {
    addUserMessage.textContent = message;
    addUserMessage.className = type;
    addUserMessage.style.display = 'block';
    
    if (type === 'error') {
        addUserMessage.style.backgroundColor = '#ffebee';
        addUserMessage.style.color = '#c62828';
    } else {
        addUserMessage.style.backgroundColor = '#e8f5e8';
        addUserMessage.style.color = '#2e7d32';
    }
    
    // 3秒后隐藏消息
    setTimeout(() => {
        addUserMessage.style.display = 'none';
    }, 3000);
}

// 辅助函数
function showLoginMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = type;
    loginMessage.style.display = 'block';
    
    if (type === 'error') {
        loginMessage.style.backgroundColor = '#ffebee';
        loginMessage.style.color = '#c62828';
    } else {
        loginMessage.style.backgroundColor = '#e8f5e8';
        loginMessage.style.color = '#2e7d32';
    }
}
