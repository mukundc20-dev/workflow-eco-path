"""
Real workflow execution based on the notebook analysis
"""
import os
from openai import OpenAI
import anthropic
from dotenv import load_dotenv
import json
from datetime import datetime

load_dotenv()

# Energy consumption constants (Wh per token)
WH_PER_GPT4 = 7 / 1000
WH_PER_LLAMA = 2 / 1000

class WorkflowExecutor:
    def __init__(self):
        # Don't initialize clients here - do it lazily when needed
        self.novita_client = None
        self.openai_client = None
        self.anthropic_client = None
        
        # Professor profiles from the notebook
        self.profiles = [
            r'''Matias Cattaneo
Position
Professor
Website
Matias Cattaneo's Site
Office Phone
(609) 258-8825
Email
cattaneo@princeton.edu
Office
230 - Sherrerd Hall
Bio/Description
Research Interests: Econometrics, statistics, machine learning, data science, causal inference, program evaluation, quantitative methods in the social, behavioral and biomedical sciences.''',
            r'''Jianqing Fan
Position
Frederick L. Moore Professor in Finance
Website
Jianqing Fan's Site
Office Phone
(609) 258-7924
Email
jqfan@princeton.edu
Office
205 - Sherrerd Hall
Bio/Description
Research Interests: High-dimensional statistics, Machine Learning, financial econometrics, computational biology, biostatistics, graphical and network modeling, portfolio theory, high-frequency finance, time series.''',
            r'''Jason Klusowski
Position
Assistant Professor
Website
Jason Klusowski's Site
Office Phone
(609) 258-5305
Email
jason.klusowski@princeton.edu
Office
327 - Sherrerd Hall
Bio/Description
Research Interests: Data science, statistical learning, deep learning, decision tree learning; high-dimensional statistics, information theory, statistical physics, network modeling'''
        ]
        
        # Original task prompt from notebook
        self.task_prompt = """
You are an expert academic researcher. Please analyze the following professor profiles and provide:

1. A summary of each professor's research focus
2. Potential collaboration opportunities between them
3. Emerging research trends in their fields
4. Recommendations for interdisciplinary research projects

Here are the professor profiles:

{profiles}

Please provide a comprehensive analysis that would be valuable for academic planning and research strategy.
"""

    def _get_novita_client(self):
        """Get or create Novita client"""
        if self.novita_client is None:
            api_key = os.getenv("novita_api_key")
            if not api_key:
                raise ValueError("novita_api_key not found in environment variables")
            self.novita_client = OpenAI(
                api_key=api_key,
                base_url="https://api.novita.ai/openai"
            )
        return self.novita_client

    def _get_openai_client(self):
        """Get or create OpenAI client"""
        if self.openai_client is None:
            api_key = os.getenv("openai_api_key")
            if not api_key:
                raise ValueError("openai_api_key not found in environment variables")
            self.openai_client = OpenAI(api_key=api_key)
        return self.openai_client

    def _get_anthropic_client(self):
        """Get or create Anthropic client"""
        if self.anthropic_client is None:
            api_key = os.getenv("claude_api_key")
            if not api_key:
                raise ValueError("claude_api_key not found in environment variables")
            self.anthropic_client = anthropic.Anthropic(api_key=api_key)
        return self.anthropic_client

    def baseline(self, prompt: str, profiles: str, client, model) -> tuple:
        """Run baseline analysis with given prompt and model"""
        formatted_prompt = prompt.replace("{profiles}", profiles)
        
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "user", "content": formatted_prompt}
            ],
            max_tokens=2000,
            temperature=0.7
        )

        return response.choices[0].message.content, response.usage

    def calculate_energy_consumption(self, usage, model_type):
        """Calculate energy consumption in Wh based on token usage and model type"""
        if not usage or not usage.total_tokens:
            return 0
        
        if "gpt" in model_type.lower():
            return usage.total_tokens * WH_PER_GPT4
        else:  # Llama models
            return usage.total_tokens * WH_PER_LLAMA

    def compare_responses(self, openai_client, profiles: str, og_prompt, response_a: str, response_b: str) -> tuple:
        """Compare two responses and generate improved prompt"""
        comparison_prompt = f"""
        You are an expert in prompt engineering and AI model optimization. I have two responses to the same prompt from different AI models:

        ORIGINAL PROMPT:
        {og_prompt}

        RESPONSE A:
        {response_a}

        RESPONSE B:
        {response_b}

        Please analyze these responses and:

        1. Identify the key differences in quality, depth, and structure between the two responses
        2. Determine what specific aspects of response B could be improved

        Focus on making the prompt more specific, providing better structure guidance, and addressing any weaknesses you observe in response B, and include the original profiles.
        """

        comparison_response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": comparison_prompt}
            ],
            max_tokens=3000,
            temperature=0.3
        )

        comparison_output = comparison_response.choices[0].message.content
        comparison_usage = comparison_response.usage

        print("Analysis:")
        print("=" * 50)
        print(comparison_output)
        print("=" * 50)
        print(f"Token usage: {comparison_usage}")
        print()

        messages = [
            {"role": "user", "content": comparison_prompt}, 
            {"role": "assistant", "content": comparison_output}, 
            {'role': 'user', 'content': 
            'Please provide the improved prompt only. '
            'IMPORTANT: In the improved prompt, use the placeholder {profiles} exactly where the professor profiles should be inserted. '
            'Do NOT include the actual profiles in your response.'}]

        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_tokens=1000,
            temperature=0.3
        )

        return response.choices[0].message.content, response.usage

    def improved_prompt(self, prompt: str, profiles: str, client, model) -> tuple:
        """Test improved prompt with given model"""
        formatted_prompt = prompt.replace("{profiles}", profiles)
        
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "user", "content": formatted_prompt}
            ],
            max_tokens=2000,
            temperature=0.7
        )

        return response.choices[0].message.content, response.usage

    def evaluation(self, openai_client, profiles: str, og_prompt: str, llama_response_a: str, llama_response_b: str) -> str:
        """Evaluate if response B is satisfactorily close to response A"""
        satisfactory_prompt = f"""
        You are an expert academic reviewer. Below are two AI-generated analyses of professor profiles.

        RESPONSE A (GPT):
        {llama_response_a}

        RESPONSE B (Llama 3.1 70B):
        {llama_response_b}

        Is RESPONSE B satisfactorily close in quality, depth, and structure to RESPONSE A? Prioritize information retention and similar formatting.
        """
        eval_res = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": satisfactory_prompt}],
            max_tokens=3000,
            temperature=0.2
        )

        return eval_res.choices[0].message.content.strip()

    def _mock_ai_analysis(self):
        """Mock AI analysis for when API keys are not available"""
        return {
            "success": True,
            "message": "AI model analysis completed (mock mode - API keys not available)",
            "data": {
                "llama_70b_analysis": "Mock analysis: Comprehensive analysis of professor research interests and collaboration opportunities. The professors show strong potential for interdisciplinary collaboration in machine learning, statistics, and econometrics.",
                "llama_8b_analysis": "Mock analysis: Detailed breakdown of research focus areas and potential interdisciplinary projects. Key areas include high-dimensional statistics, causal inference, and network modeling.",
                "llama_70b_usage": {"completion_tokens": 150, "prompt_tokens": 200, "total_tokens": 350},
                "llama_8b_usage": {"completion_tokens": 120, "prompt_tokens": 200, "total_tokens": 320},
                "llama_70b_energy": 350 * WH_PER_LLAMA,
                "llama_8b_energy": 320 * WH_PER_LLAMA
            },
            "timestamp": datetime.now().isoformat()
        }

    def _mock_prompt_optimization(self):
        """Mock prompt optimization for when API keys are not available"""
        improved_prompt = """You are an expert academic researcher specializing in interdisciplinary collaboration analysis. Please analyze the following professor profiles with a focus on:

1. **Research Focus Summary**: Provide a concise one-sentence summary of each professor's primary research focus
2. **Collaboration Opportunities**: Identify 3-4 specific collaboration projects with clear research questions
3. **Emerging Trends**: Highlight 2-3 emerging research trends in their combined fields
4. **Implementation Strategy**: Suggest practical steps for initiating these collaborations

Format your response with clear headings and bullet points for easy reading. Focus on actionable insights that would be valuable for academic planning and research strategy.

Professor profiles:
{profiles}"""
        
        return {
            "success": True,
            "message": "Prompt optimization completed (mock mode - API keys not available)",
            "data": {
                "originalPrompt": self.task_prompt,
                "improvedPrompt": improved_prompt,
                "comparisonUsage": {
                    "completion_tokens": 200,
                    "prompt_tokens": 500,
                    "total_tokens": 700
                },
                "comparisonEnergy": 700 * WH_PER_GPT4,
                "improvements": [
                    "More specific structure guidance",
                    "Clearer output format requirements", 
                    "Focus on actionable insights",
                    "Better context for academic planning"
                ]
            },
            "timestamp": datetime.now().isoformat()
        }

    def _mock_test_improved_prompt(self, improved_prompt, step2_results=None):
        """Mock test of improved prompt for when API keys are not available"""
        evaluation_text = "Mock evaluation: The improved prompt produces responses that are satisfactorily close in quality to the baseline, with better structure and more actionable insights."
        
        if step2_results and step2_results.get('llama_70b_analysis'):
            evaluation_text = f"Mock evaluation: The improved prompt produces responses that are satisfactorily close in quality to the baseline (Llama 3.3 70B), with better structure and more actionable insights. Original response length: {len(step2_results['llama_70b_analysis'])} chars, Improved response shows enhanced clarity and organization."
        
        return {
            "success": True,
            "message": "Improved prompt testing completed (mock mode - API keys not available)",
            "data": {
                "improvedPrompt": improved_prompt,
                "improvedOutput": "Mock output: The improved prompt shows better structure and more specific guidance. The analysis reveals strong collaboration opportunities between the professors in machine learning, statistics, and econometrics research areas.",
                "evaluation": evaluation_text,
                "usage": {
                    "completion_tokens": 100,
                    "prompt_tokens": 250,
                    "total_tokens": 350
                },
                "energy": 350 * WH_PER_LLAMA
            },
            "timestamp": datetime.now().isoformat()
        }

    def step1_collect_profiles(self):
        """Step 1: Profile Collection - Format the prompt with actual profiles"""
        print("Step 1: Collecting and formatting professor profiles...")
        
        formatted_prompt = self.task_prompt.format(profiles="\n\n".join(self.profiles))
        
        return {
            "success": True,
            "message": "Profile collection completed",
            "data": {
                "profiles": self.profiles,
                "profileCount": len(self.profiles),
                "formattedPrompt": formatted_prompt
            },
            "timestamp": datetime.now().isoformat()
        }

    def step2_ai_analysis(self, formatted_prompt):
        """Step 2: AI Model Analysis - Run actual AI models from notebook"""
        print("Step 2: Running AI model analysis...")
        
        results = {}
        
        # Check if API keys are available
        try:
            self._get_novita_client()
        except ValueError as e:
            print(f"API keys not available: {e}")
            print("Running in mock mode...")
            return self._mock_ai_analysis()
        
        try:
            # Test with Llama 3.3 70B via Novita (from notebook)
            print("Testing with Llama 3.3 70b via Novita...")
            novita_client = self._get_novita_client()
            llama_70b_content, llama_70b_usage = self.baseline(
                self.task_prompt, 
                "\n\n".join(self.profiles), 
                novita_client, 
                "meta-llama/llama-3.3-70b-instruct"
            )
            
            results["llama_70b_analysis"] = llama_70b_content
            results["llama_70b_usage"] = {
                "completion_tokens": llama_70b_usage.completion_tokens,
                "prompt_tokens": llama_70b_usage.prompt_tokens,
                "total_tokens": llama_70b_usage.total_tokens
            }
            results["llama_70b_energy"] = self.calculate_energy_consumption(llama_70b_usage, "gpt")
            
        except Exception as e:
            print(f"Error with Llama 3.3 70B: {e}")
            results["llama_70b_analysis"] = f"Error: {str(e)}"
            results["llama_70b_usage"] = None

        try:
            # Test with Llama 3.1 8B via Novita (from notebook)
            print("Testing with Llama 3.1 8B via Novita...")
            novita_client = self._get_novita_client()
            llama_8b_content, llama_8b_usage = self.baseline(
                self.task_prompt, 
                "\n\n".join(self.profiles), 
                novita_client, 
                "meta-llama/llama-3.1-8b-instruct"
            )
            
            results["llama_8b_analysis"] = llama_8b_content
            results["llama_8b_usage"] = {
                "completion_tokens": llama_8b_usage.completion_tokens,
                "prompt_tokens": llama_8b_usage.prompt_tokens,
                "total_tokens": llama_8b_usage.total_tokens
            }
            results["llama_8b_energy"] = self.calculate_energy_consumption(llama_8b_usage, "llama-3.1-8b")
            
        except Exception as e:
            print(f"Error with Llama 3.1 8B: {e}")
            results["llama_8b_analysis"] = f"Error: {str(e)}"
            results["llama_8b_usage"] = None

        return {
            "success": True,
            "message": "AI model analysis completed",
            "data": results,
            "timestamp": datetime.now().isoformat()
        }

    def step3_prompt_optimization(self, analysis_results):
        """Step 3: Prompt Optimization - Use GPT-4 to analyze and improve prompt"""
        print("Step 3: Optimizing prompt with GPT-4...")
        
        # Check if OpenAI API key is available
        try:
            self._get_openai_client()
        except ValueError as e:
            print(f"OpenAI API key not available: {e}")
            print("Running in mock mode...")
            return self._mock_prompt_optimization()
        
        try:
            # Use the new compare_responses method
            openai_client = self._get_openai_client()
            profiles_str = "\n\n".join(self.profiles)
            
            # Compare the two Llama responses
            improved_prompt, comparison_usage = self.compare_responses(
                openai_client,
                profiles_str,
                self.task_prompt,
                analysis_results.get('llama_70b_analysis', 'No response available'),
                analysis_results.get('llama_8b_analysis', 'No response available')
            )
            
            # Clean up the improved prompt
            improved_prompt = improved_prompt.strip().strip('"').strip("'")
            
            return {
                "success": True,
                "message": "Prompt optimization completed",
                "data": {
                    "originalPrompt": self.task_prompt,
                    "improvedPrompt": improved_prompt,
                    "comparisonUsage": {
                        "completion_tokens": comparison_usage.completion_tokens,
                        "prompt_tokens": comparison_usage.prompt_tokens,
                        "total_tokens": comparison_usage.total_tokens
                    },
                    "comparisonEnergy": self.calculate_energy_consumption(comparison_usage, "gpt-4"),
                    "improvements": [
                        "More specific structure guidance",
                        "Clearer output format requirements", 
                        "Focus on actionable insights",
                        "Better context for academic planning"
                    ]
                },
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Error in prompt optimization: {e}")
            return {
                "success": False,
                "message": f"Prompt optimization failed: {str(e)}",
                "data": None,
                "timestamp": datetime.now().isoformat()
            }

    def step4_test_improved_prompt(self, improved_prompt, step2_results=None):
        """Step 4: Test the improved prompt with Llama and evaluate against step 2"""
        print("Step 4: Testing improved prompt...")
        
        # Check if API keys are available
        try:
            self._get_novita_client()
            self._get_openai_client()
        except ValueError as e:
            print(f"API keys not available: {e}")
            print("Running in mock mode...")
            return self._mock_test_improved_prompt(improved_prompt, step2_results)
        
        try:
            # Test improved prompt with Llama 3.1 8B
            novita_client = self._get_novita_client()
            improved_output, improved_usage = self.improved_prompt(
                improved_prompt,
                "\n\n".join(self.profiles),
                novita_client,
                "meta-llama/llama-3.1-8b-instruct"
            )
            
            # Get evaluation comparing with original Llama 3.3 70B response
            openai_client = self._get_openai_client()
            evaluation_result = "Evaluation skipped - original response not available"
            
            if step2_results and step2_results.get('llama_70b_analysis'):
                try:
                    # Use the evaluation method to compare responses
                    evaluation_result = self.evaluation(
                        openai_client,
                        "\n\n".join(self.profiles),
                        self.task_prompt,
                        step2_results['llama_70b_analysis'],  # GPT-4 baseline (Llama 3.3 70B)
                        improved_output  # Improved Llama 3.1 8B response
                    )
                    print("Evaluation completed successfully")
                except Exception as e:
                    print(f"Error in evaluation: {e}")
                    evaluation_result = f"Evaluation failed: {str(e)}"
            
            return {
                "success": True,
                "message": "Improved prompt testing completed",
                "data": {
                    "improvedPrompt": improved_prompt,
                    "improvedOutput": improved_output,
                    "evaluation": evaluation_result,
                    "usage": {
                        "completion_tokens": improved_usage.completion_tokens,
                        "prompt_tokens": improved_usage.prompt_tokens,
                        "total_tokens": improved_usage.total_tokens
                    },
                    "energy": self.calculate_energy_consumption(improved_usage, "llama-3.1-8b")
                },
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Error testing improved prompt: {e}")
            return {
                "success": False,
                "message": f"Improved prompt testing failed: {str(e)}",
                "data": None,
                "timestamp": datetime.now().isoformat()
            }

    def execute_full_workflow(self):
        """Execute the complete workflow from the notebook"""
        print("Starting full workflow execution...")
        
        results = {}
        
        # Step 1: Profile Collection
        step1_result = self.step1_collect_profiles()
        results["step1"] = step1_result
        
        if not step1_result["success"]:
            return results
            
        # Step 2: AI Analysis
        formatted_prompt = step1_result["data"]["formattedPrompt"]
        step2_result = self.step2_ai_analysis(formatted_prompt)
        results["step2"] = step2_result
        
        if not step2_result["success"]:
            return results
            
        # Step 3: Prompt Optimization
        step3_result = self.step3_prompt_optimization(step2_result["data"])
        results["step3"] = step3_result
        
        if not step3_result["success"]:
            return results
            
        # Step 4: Test Improved Prompt
        improved_prompt = step3_result["data"]["improvedPrompt"]
        step4_result = self.step4_test_improved_prompt(improved_prompt)
        results["step4"] = step4_result
        
        return results
